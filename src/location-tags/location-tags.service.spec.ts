import { Test, TestingModule } from '@nestjs/testing';
import { LocationTagsService } from './location-tags.service';
import { PrismaService } from '../prisma.service';

describe('LocationTagsService', () => {
  let service: LocationTagsService;
  const prismaServiceMock = {
    locationTags: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationTagsService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<LocationTagsService>(LocationTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
