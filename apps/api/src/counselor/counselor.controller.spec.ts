import { Test, TestingModule } from '@nestjs/testing';
import { CounselorController } from './counselor.controller';
import { CounselorService } from './counselor.service';

describe('CounselorController', () => {
  let controller: CounselorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CounselorController],
      providers: [CounselorService],
    }).compile();

    controller = module.get<CounselorController>(CounselorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
