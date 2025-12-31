import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserType } from '../users/entities/user.entity';
import { Establishment, OfferType } from '../establishments/entities/establishment.entity';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe;
  private readonly successUrl: string;
  private readonly cancelUrl: string;
  private readonly webhookSecret: string | undefined;
  private readonly priceIdForUser: string | undefined;
  private readonly priceIdForOwner: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Establishment)
    private readonly establishmentsRepository: Repository<Establishment>,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (!secretKey) {
      this.logger.warn('STRIPE_SECRET_KEY is not set. Stripe is disabled.');
    }
    this.stripe = new Stripe(secretKey ?? 'sk_test_placeholder', {
      apiVersion: '2024-06-20',
    });

    this.successUrl =
      this.configService.get<string>('STRIPE_SUCCESS_URL') ?? 'http://localhost:5173/stripe/success';
    this.cancelUrl =
      this.configService.get<string>('STRIPE_CANCEL_URL') ?? 'http://localhost:5173/stripe/cancel';

    this.webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    this.priceIdForUser = this.configService.get<string>('STRIPE_PRICE_USER');
    this.priceIdForOwner = this.configService.get<string>('STRIPE_PRICE_OWNER');
  }

  async createCheckoutSessionForUserId(userId: number): Promise<{ url: string; id: string }> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    const priceId = this.selectPriceIdForRole(user.role);

    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: this.successUrl + '?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: this.cancelUrl,
        line_items: [
          { price: priceId, quantity: 1 },
        ],
        client_reference_id: String(user.id),
        metadata: {
          userId: String(user.id),
          role: user.role,
          purpose: 'profile_value_unlock',
        },
      });

      return { url: session.url!, id: session.id };
    } catch (err) {
      this.logger.error('Failed to create checkout session', err as Error);
      throw new InternalServerErrorException('Unable to create checkout session');
    }
  }

  private selectPriceIdForRole(role: UserType): string {
    if (role === UserType.OWNER) {
      if (!this.priceIdForOwner) throw new InternalServerErrorException('STRIPE_PRICE_OWNER not set');
      return this.priceIdForOwner;
    }
    if (!this.priceIdForUser) throw new InternalServerErrorException('STRIPE_PRICE_USER not set');
    return this.priceIdForUser;
  }

  verifyAndParseEvent(rawBody: Buffer, signature: string | undefined): Stripe.Event {
    if (!this.webhookSecret) {
      throw new InternalServerErrorException('Missing STRIPE_WEBHOOK_SECRET');
    }
    if (!signature) {
      throw new InternalServerErrorException('Missing Stripe-Signature header');
    }

    return this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      this.webhookSecret,
    );
  }

  async createCheckoutSessionForEstablishment(userId: number): Promise<{ url: string; id: string }> {
    const establishment = await this.establishmentsRepository.findOne({
      where: { owner_account_id: userId }
    });

    if (!establishment) {
      throw new NotFoundException('Establishment not found for this owner');
    }

    if (establishment.offer === OfferType.PREMIUM) {
      throw new InternalServerErrorException('Establishment is already PREMIUM');
    }

    if (!this.priceIdForOwner) {
      throw new InternalServerErrorException('STRIPE_PRICE_OWNER not set');
    }

    try {
      const session = await this.stripe.checkout.sessions.create({
        mode: 'subscription',
        success_url: this.successUrl + '?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: this.cancelUrl,
        line_items: [
          { price: this.priceIdForOwner, quantity: 1 },
        ],
        client_reference_id: String(establishment.id),
        metadata: {
          userId: String(userId),
          establishmentId: String(establishment.id),
          purpose: 'establishment_premium_upgrade',
        },
      });

      return { url: session.url!, id: session.id };
    } catch (err) {
      this.logger.error('Failed to create checkout session for establishment', err as Error);
      throw new InternalServerErrorException('Unable to create checkout session');
    }
  }

  async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const purpose = session.metadata?.purpose;

    if (purpose === 'establishment_premium_upgrade') {
      await this.handleEstablishmentPremiumUpgrade(session);
    } else if (purpose === 'profile_value_unlock') {
      await this.handleProfileValueUnlock(session);
    } else {
      // Fallback pour compatibilité avec l'ancien système
      await this.handleProfileValueUnlock(session);
    }
  }

  private async handleEstablishmentPremiumUpgrade(session: Stripe.Checkout.Session): Promise<void> {
    const establishmentIdRaw = session.metadata?.establishmentId || session.client_reference_id;
    if (!establishmentIdRaw) {
      this.logger.warn('Checkout session completed without establishmentId metadata');
      return;
    }

    const establishment = await this.establishmentsRepository.findOne({
      where: { id: establishmentIdRaw }
    });

    if (!establishment) {
      this.logger.warn(`Establishment not found for checkout session: ${establishmentIdRaw}`);
      return;
    }

    // Récupérer la subscription créée pour stocker l'ID dans les métadonnées
    // On va chercher la subscription via le customer_id de la session
    if (session.subscription) {
      try {
        const subscription = await this.stripe.subscriptions.retrieve(session.subscription as string);
        // Mettre à jour les métadonnées de la subscription avec l'établissement ID
        await this.stripe.subscriptions.update(subscription.id, {
          metadata: {
            establishmentId: String(establishment.id),
            purpose: 'establishment_premium_upgrade',
          },
        });
      } catch (err) {
        this.logger.warn('Failed to update subscription metadata', err as Error);
      }
    }

    establishment.offer = OfferType.PREMIUM;
    await this.establishmentsRepository.save(establishment);
    this.logger.log(`Establishment ${establishmentIdRaw} upgraded to PREMIUM`);
  }

  private async handleProfileValueUnlock(session: Stripe.Checkout.Session): Promise<void> {
    const userIdRaw = (session.metadata && session.metadata['userId']) || session.client_reference_id;
    const userId = userIdRaw ? Number(userIdRaw) : undefined;
    if (!userId) {
      this.logger.warn('Checkout session completed without userId metadata');
      return;
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.warn(`User not found for checkout session: ${userId}`);
      return;
    }

    user.profile_value_unlocked = true;
    await this.usersRepository.save(user);
  }

  async getCheckoutSessionStatus(sessionId: string): Promise<{ status: string; paid: boolean }> {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      return {
        status: session.status || 'unknown',
        paid: session.payment_status === 'paid',
      };
    } catch (err) {
      this.logger.error('Failed to retrieve checkout session', err as Error);
      throw new InternalServerErrorException('Unable to retrieve checkout session');
    }
  }

  async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    // Récupérer l'établissement via le customer_id ou les métadonnées
    const customerId = subscription.customer as string;

    try {
      // Récupérer le customer pour obtenir les métadonnées
      const customer = await this.stripe.customers.retrieve(customerId);

      if (typeof customer === 'string' || customer.deleted) {
        this.logger.warn(`Customer ${customerId} not found or deleted`);
        return;
      }

      // Chercher l'établissement via le customer_id dans les métadonnées ou via owner_account_id
      // On va chercher toutes les subscriptions pour trouver celle qui correspond
      const establishmentId = subscription.metadata?.establishmentId;

      if (establishmentId) {
        const establishment = await this.establishmentsRepository.findOne({
          where: { id: establishmentId }
        });

        if (establishment) {
          this.logger.log(`Found establishment ${establishmentId}, current offer: ${establishment.offer}`);

          establishment.offer = OfferType.STANDARD;
          await this.establishmentsRepository.save(establishment);
          this.logger.log(`Establishment ${establishmentId} downgraded to STANDARD`);
        } else {
          this.logger.warn(`Establishment not found for subscription: ${establishmentId}`);
        }
      } else {
        // Fallback: chercher dans les checkout sessions récentes pour ce customer
        this.logger.warn('No establishmentId in subscription metadata, searching in checkout sessions');
        let foundEstablishmentId: string | null = null;

        try {
          // Récupérer les checkout sessions pour ce customer
          const sessions = await this.stripe.checkout.sessions.list({
            customer: customerId,
            limit: 20, // Chercher dans les 20 dernières sessions
          });

          // Chercher la session qui correspond à cette subscription
          // On vérifie si la session a créé cette subscription
          for (const session of sessions.data) {
            if (session.subscription === subscription.id) {
              // Trouvé ! Récupérer l'établissement ID depuis les métadonnées ou client_reference_id
              foundEstablishmentId = session.metadata?.establishmentId || session.client_reference_id || null;
              if (foundEstablishmentId) {
                this.logger.log(`Found establishmentId ${foundEstablishmentId} from checkout session ${session.id}`);
                break;
              }
            }
          }

          // Si pas trouvé par subscription.id, chercher la session la plus récente avec establishmentId
          if (!foundEstablishmentId) {
            for (const session of sessions.data) {
              const sessionEstablishmentId = session.metadata?.establishmentId || session.client_reference_id;
              if (sessionEstablishmentId && session.mode === 'subscription') {
                foundEstablishmentId = sessionEstablishmentId;
                this.logger.log(`Found establishmentId ${foundEstablishmentId} from recent checkout session ${session.id} (fallback)`);
                break;
              }
            }
          }
        } catch (err) {
          this.logger.warn('Failed to search checkout sessions', err as Error);
        }

        // Si on a trouvé un establishmentId, mettre à jour l'établissement
        if (foundEstablishmentId) {
          const establishment = await this.establishmentsRepository.findOne({
            where: { id: foundEstablishmentId }
          });

          if (establishment) {
            this.logger.log(`Found establishment ${foundEstablishmentId}, current offer: ${establishment.offer}`);
            establishment.offer = OfferType.STANDARD;
            await this.establishmentsRepository.save(establishment);
            this.logger.log(`Establishment ${foundEstablishmentId} downgraded to STANDARD`);
          } else {
            this.logger.warn(`Establishment not found for subscription: ${foundEstablishmentId}`);
          }
        } else {
          this.logger.error(`Could not determine establishmentId for deleted subscription ${subscription.id} (customer: ${customerId})`);
        }
      }
    } catch (err) {
      this.logger.error('Failed to handle subscription deleted', err as Error);
    }
  }

  async cancelSubscriptionForEstablishment(userId: number): Promise<void> {
    const establishment = await this.establishmentsRepository.findOne({
      where: { owner_account_id: userId }
    });

    if (!establishment) {
      throw new NotFoundException('Establishment not found for this owner');
    }

    if (establishment.offer !== OfferType.PREMIUM) {
      throw new InternalServerErrorException('Establishment is not PREMIUM');
    }

    if (!this.priceIdForOwner) {
      throw new InternalServerErrorException('STRIPE_PRICE_OWNER not set');
    }

    try {
      // Chercher la subscription pour cet établissement
      // On cherche d'abord les subscriptions actives, puis les autres statuts
      let subscriptionToCancel: Stripe.Subscription | null = null;

      // Méthode 1: Chercher les subscriptions actives avec le price owner
      const activeSubscriptions = await this.stripe.subscriptions.list({
        limit: 100,
        status: 'active',
        price: this.priceIdForOwner,
      });

      this.logger.log(`Found ${activeSubscriptions.data.length} active subscriptions for price ${this.priceIdForOwner}`);

      // Chercher par metadata d'abord
      for (const subscription of activeSubscriptions.data) {
        if (subscription.metadata?.establishmentId === establishment.id) {
          subscriptionToCancel = subscription;
          this.logger.log(`Found subscription ${subscription.id} via metadata for establishment ${establishment.id}`);
          break;
        }
      }

      // Si pas trouvé via metadata, prendre la première subscription active avec le bon price
      if (!subscriptionToCancel && activeSubscriptions.data.length > 0) {
        subscriptionToCancel = activeSubscriptions.data[0];
        this.logger.warn(`No metadata found, using first matching subscription ${subscriptionToCancel.id} for establishment ${establishment.id}`);
      }

      // Méthode 2: Si pas trouvé, chercher aussi les subscriptions trialing, past_due, etc.
      if (!subscriptionToCancel) {
        this.logger.log('No active subscription found, searching for other statuses');
        const allSubscriptions = await this.stripe.subscriptions.list({
          limit: 100,
          price: this.priceIdForOwner,
        });

        // Filtrer pour exclure les subscriptions déjà annulées ou supprimées
        const cancellableSubscriptions = allSubscriptions.data.filter(
          sub => sub.status !== 'canceled' && sub.status !== 'unpaid' && !sub.canceled_at
        );

        this.logger.log(`Found ${cancellableSubscriptions.length} cancellable subscriptions (excluding canceled/unpaid)`);

        // Chercher par metadata
        for (const subscription of cancellableSubscriptions) {
          if (subscription.metadata?.establishmentId === establishment.id) {
            subscriptionToCancel = subscription;
            this.logger.log(`Found subscription ${subscription.id} (status: ${subscription.status}) via metadata`);
            break;
          }
        }

        // Si toujours pas trouvé, prendre la première subscription annulable
        if (!subscriptionToCancel && cancellableSubscriptions.length > 0) {
          subscriptionToCancel = cancellableSubscriptions[0];
          this.logger.warn(`Using first cancellable subscription ${subscriptionToCancel.id} (status: ${subscriptionToCancel.status})`);
        }
      }

      // Si on a trouvé une subscription, l'annuler
      if (subscriptionToCancel) {
        // Vérifier si elle n'est pas déjà annulée
        if (subscriptionToCancel.status === 'canceled' || subscriptionToCancel.canceled_at) {
          this.logger.warn(`Subscription ${subscriptionToCancel.id} is already canceled, updating establishment to STANDARD`);
          // Mettre à jour l'établissement même si la subscription est déjà annulée
          establishment.offer = OfferType.STANDARD;
          await this.establishmentsRepository.save(establishment);
          return;
        }

        // Annuler la subscription
        await this.stripe.subscriptions.cancel(subscriptionToCancel.id);
        this.logger.log(`Subscription ${subscriptionToCancel.id} cancelled for establishment ${establishment.id}`);
      } else {
        // Aucune subscription trouvée - peut-être déjà supprimée ou jamais créée
        // En mode test, cela peut arriver. On met quand même l'établissement à STANDARD
        this.logger.warn(`No subscription found for establishment ${establishment.id}. This may be normal in test mode if the subscription was already deleted. Updating establishment to STANDARD anyway.`);
        establishment.offer = OfferType.STANDARD;
        await this.establishmentsRepository.save(establishment);
        this.logger.log(`Establishment ${establishment.id} set to STANDARD (no subscription to cancel)`);
      }
    } catch (err) {
      this.logger.error('Failed to cancel subscription', err as Error);

      // Si c'est une erreur "not found", mettre quand même l'établissement à STANDARD
      // car en mode test, la subscription peut avoir été supprimée manuellement
      if (err instanceof NotFoundException) {
        this.logger.warn('Subscription not found, but updating establishment to STANDARD anyway');
        establishment.offer = OfferType.STANDARD;
        await this.establishmentsRepository.save(establishment);
        throw new NotFoundException('Active subscription not found for this establishment, but establishment has been set to STANDARD');
      }

      throw new InternalServerErrorException('Unable to cancel subscription');
    }
  }
}
