import { Test, TestingModule } from '@nestjs/testing';
import { BmstuLabController } from './bmstu-lab.controller';

describe('BmstuLabController', () => {
  let controller: BmstuLabController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BmstuLabController],
    }).compile();

    controller = module.get<BmstuLabController>(BmstuLabController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
