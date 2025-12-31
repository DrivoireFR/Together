import { Test, TestingModule } from '@nestjs/testing';
import { PartnerRegistrationController } from './partner-registration.controller';
import { PartnerRegistrationService } from './partner-registration.service';

describe('PartnerRegistrationController', () => {
  let controller: PartnerRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartnerRegistrationController],
      providers: [PartnerRegistrationService],
    }).compile();

    controller = module.get<PartnerRegistrationController>(PartnerRegistrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
