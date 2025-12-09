import { Test, TestingModule } from '@nestjs/testing';
import { BmstuLabService } from './bmstu-lab.service';

describe('BmstuLabService', () => {
  let service: BmstuLabService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BmstuLabService],
    }).compile();

    service = module.get<BmstuLabService>(BmstuLabService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
