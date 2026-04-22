import { Test, TestingModule } from '@nestjs/testing';
import { CollectionItemsService } from './collection-items.service';
import { PrismaService } from '../prisma.service';

describe('CollectionItemsService', () => {
  let service: CollectionItemsService;
  const prismaServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectionItemsService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
      ],
    }).compile();

    service = module.get<CollectionItemsService>(CollectionItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
