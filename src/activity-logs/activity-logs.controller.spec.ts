import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogsController } from './activity-logs.controller';
import { ActivityLogsService } from './activity-logs.service';
import { AuthGuard } from '../models/auth/auth.guard';

describe('ActivityLogsController', () => {
  let controller: ActivityLogsController;
  const activityLogsServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityLogsController],
      providers: [
        {
          provide: ActivityLogsService,
          useValue: activityLogsServiceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<ActivityLogsController>(ActivityLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
