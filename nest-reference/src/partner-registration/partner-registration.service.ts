import { HttpException, Injectable } from '@nestjs/common';
import { CreatePartnerRegistrationDto } from './dto/create-partner-registration.dto';
import { UpdatePartnerRegistrationDto } from './dto/update-partner-registration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PartnerRegistration } from './entities/partner-registration.entity';
import { IsNull, Repository } from 'typeorm';
import { PartnerAlreadyRequestedRegistrationException } from './partner-registration.exceptions';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PartnerRegistrationService {
  constructor(
    @InjectRepository(PartnerRegistration)
    private partnerRegistrationRepository: Repository<PartnerRegistration>,
    private readonly mailService: MailService,
  ) { }

  async create(createPartnerRegistrationDto: CreatePartnerRegistrationDto) {
    const { first_name, last_name, email, phone, establishment } = createPartnerRegistrationDto

    const existingRequest = await this.partnerRegistrationRepository.findOne({
      where: [
        { email: createPartnerRegistrationDto.email },
      ]
    });

    if (existingRequest) {
      throw new PartnerAlreadyRequestedRegistrationException()
    }

    const partnerRegistration = new PartnerRegistration()
    partnerRegistration.first_name = first_name
    partnerRegistration.last_name = last_name
    partnerRegistration.email = email
    partnerRegistration.phone = phone
    partnerRegistration.establishment = establishment

    try {
      await this.partnerRegistrationRepository.save(partnerRegistration)
    }
    catch (err) {
      throw new HttpException(err, 500);
    }

    // Fire-and-forget confirmation email; do not block response
    this.mailService
      .send({
        to: email,
        subject: 'Rencontraire – Confirmation de réception',
        template: 'partner-registration-confirmation',
        context: {
          firstName: first_name,
          establishmentName: establishment?.displayName ?? 'votre établissement',
        },
      })
      .catch(() => void 0);

    return partnerRegistration
  }

  findAll() {
    return this.partnerRegistrationRepository.find();
  }

  findNotProcessedOnes() {
    return this.partnerRegistrationRepository.findBy({
      processed_by_admin_id: IsNull()
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} partnerRegistration`;
  }

  update(id: number, updatePartnerRegistrationDto: UpdatePartnerRegistrationDto) {
    return `This action updates a #${id} partnerRegistration`;
  }

  remove(id: number) {
    return `This action removes a #${id} partnerRegistration`;
  }
}
