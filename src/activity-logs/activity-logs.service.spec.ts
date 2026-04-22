import { Test, TestingModule } from '@nestjs/testing';
import { ActivityLogsService } from './activity-logs.service';
import { PrismaService } from '../prisma.service';

describe('ActivityLogsService', () => {
  let service: ActivityLogsService;
  const prismaServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogsService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<ActivityLogsService>(ActivityLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
