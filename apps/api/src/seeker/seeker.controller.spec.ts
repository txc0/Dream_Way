import { Test, TestingModule } from '@nestjs/testing';
import { SeekerController } from './seeker.controller';
import { SeekerService } from './seeker.service';

describe('SeekerController', () => {
  let controller: SeekerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeekerController],
      providers: [SeekerService],
    }).compile();

    controller = module.get<SeekerController>(SeekerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
