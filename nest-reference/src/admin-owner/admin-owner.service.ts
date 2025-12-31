import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PartnerRegistration } from '../partner-registration/entities/partner-registration.entity';
import { UpdatePartnerRegistrationAdminDto } from './dto/update-partner-registration-admin.dto';
import { MailService } from '../mail/mail.service';
import { PartnerRegistrationStatus } from '../partner-registration/entities/partner-registration.entity';
import { Establishment, OfferType } from '../establishments/entities/establishment.entity';
import { User, UserType } from '../users/entities/user.entity';

@Injectable()
export class AdminOwnerService {
    constructor(
        @InjectRepository(PartnerRegistration)
        private partnerRegistrationRepository: Repository<PartnerRegistration>,
        @InjectRepository(Establishment)
        private establishmentsRepository: Repository<Establishment>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly mailService: MailService,
    ) { }

    async updatePartnerRegistration(
        id: string,
        updateDto: UpdatePartnerRegistrationAdminDto,
        adminId: number,
    ): Promise<PartnerRegistration> {
        const partnerRegistration = await this.partnerRegistrationRepository.findOne({
            where: { id },
        });

        if (!partnerRegistration) {
            throw new NotFoundException(`Partner registration with ID ${id} not found`);
        }

        // Sauvegarder le status précédent avant modification
        const previousStatus = partnerRegistration.status;
        const newStatus = updateDto.status;

        if (updateDto.status !== undefined) {
            partnerRegistration.status = updateDto.status;
        }
        if (updateDto.admin_notes !== undefined) {
            partnerRegistration.admin_notes = updateDto.admin_notes;
        }
        if (updateDto.rejection_reason !== undefined) {
            partnerRegistration.rejection_reason = updateDto.rejection_reason;
        }

        if (
            newStatus === PartnerRegistrationStatus.APPROVED ||
            newStatus === PartnerRegistrationStatus.REJECTED
        ) {
            partnerRegistration.processed_by_admin_id = adminId.toString();
            partnerRegistration.processed_at = new Date();
        }

        const saved = await this.partnerRegistrationRepository.save(partnerRegistration);

        // Si approuvé, assurer la création du compte OWNER et le linkage sur l'établissement
        let generatedPassword: string | undefined;
        if (newStatus === PartnerRegistrationStatus.APPROVED && previousStatus !== PartnerRegistrationStatus.APPROVED) {
            const randomPassword = Math.random().toString(36).slice(-12) + '!Aa1';
            const newUser = new User();
            newUser.email = partnerRegistration.email;
            newUser.password = randomPassword;
            newUser.role = UserType.OWNER;
            newUser.firstName = partnerRegistration.first_name;
            newUser.lastName = partnerRegistration.last_name;
            const ownerAccount = await this.usersRepository.save(newUser);
            generatedPassword = randomPassword;

            // 2) Lier l'établissement
            const placeId: string | undefined = partnerRegistration.establishment?.id;
            if (placeId) {
                let establishment = await this.establishmentsRepository.findOne({ where: { id: placeId } });

                // Créer l'établissement si manquant (à partir des données Google Places de la demande)
                if (!establishment) {
                    establishment = this.establishmentsRepository.create({
                        id: placeId,
                        name: partnerRegistration.establishment.displayName,
                        formattedAddress: partnerRegistration.establishment.formattedAddress,
                        places_data: partnerRegistration.establishment,
                        is_partner: true,
                        offer: OfferType.STANDARD,
                        owner_account_id: ownerAccount.id,
                        owner: ownerAccount,
                    });
                } else {
                    establishment.is_partner = true;
                    establishment.owner_account_id = ownerAccount.id;
                    establishment.owner = ownerAccount;
                }

                await this.establishmentsRepository.save(establishment);
            }
        }

        // Notifier via mail service si le status a changé
        if (newStatus && newStatus !== previousStatus) {
            if (newStatus === PartnerRegistrationStatus.APPROVED) {
                this.mailService.sendPartnerRegistrationApproval(saved, generatedPassword)
                    .catch(() => void 0);
            } else if (newStatus === PartnerRegistrationStatus.REJECTED) {
                this.mailService.sendPartnerRegistrationRejection(saved)
                    .catch(() => void 0);
            }
        }

        return saved;
    }
}
