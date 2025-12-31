import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Logger, Param, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { StripeService } from './stripe.service';
import { AuthGuard } from '../auth/auth.guard';
import { OwnerGuard } from '../auth/owner.guard';

@Controller('stripe')
export class StripeController {
  private readonly logger = new Logger(StripeController.name);

  constructor(private readonly stripeService: StripeService) { }

  @UseGuards(AuthGuard)
  @Post('checkout')
  async createCheckout(@Req() req: Request) {
    const userId = Number((req as any).user?.sub);
    const session = await this.stripeService.createCheckoutSessionForUserId(userId);
    return { checkoutUrl: session.url, sessionId: session.id };
  }

  @UseGuards(AuthGuard, OwnerGuard)
  @Post('checkout/establishment')
  async createCheckoutForEstablishment(@Req() req: Request) {
    const userId = Number((req as any).user?.sub);
    const session = await this.stripeService.createCheckoutSessionForEstablishment(userId);
    return { checkoutUrl: session.url, sessionId: session.id };
  }

  @UseGuards(AuthGuard)
  @Get('session/:sessionId/status')
  async getSessionStatus(@Param('sessionId') sessionId: string) {
    const status = await this.stripeService.getCheckoutSessionStatus(sessionId);
    return status;
  }

  @UseGuards(AuthGuard, OwnerGuard)
  @Post('subscription/cancel')
  async cancelSubscription(@Req() req: Request) {
    const userId = Number((req as any).user?.sub);
    await this.stripeService.cancelSubscriptionForEstablishment(userId);
    return { success: true };
  }

  // Webhook must receive raw body; that will be configured in main.ts
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Req() request: Request,
    @Headers('stripe-signature') signature?: string,
  ) {
    // body-parser raw middleware populates req.body as Buffer
    const rawCandidate: unknown = (request as any).rawBody ?? request.body;
    const rawBody: Buffer = Buffer.isBuffer(rawCandidate) ? (rawCandidate as Buffer) : Buffer.from('');

    const event = this.stripeService.verifyAndParseEvent(rawBody, signature);

    switch (event.type) {
      case 'checkout.session.completed': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = event.data.object as any; // Stripe.Checkout.Session
        await this.stripeService.handleCheckoutCompleted(session);
        break;
      }
      case 'customer.subscription.deleted': {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const subscription = event.data.object as any; // Stripe.Subscription
        await this.stripeService.handleSubscriptionDeleted(subscription);
        break;
      }
      default:
        this.logger.log(`Unhandled Stripe event type ${event.type}`);
    }

    return { received: true };
  }
}
