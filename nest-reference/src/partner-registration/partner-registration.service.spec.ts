import { Test, TestingModule } from '@nestjs/testing';
import { PartnerRegistrationService } from './partner-registration.service';

describe('PartnerRegistrationService', () => {
  let service: PartnerRegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartnerRegistrationService],
    }).compile();

    service = module.get<PartnerRegistrationService>(PartnerRegistrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
