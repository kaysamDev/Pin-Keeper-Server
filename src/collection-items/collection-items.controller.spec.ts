import { Test, TestingModule } from '@nestjs/testing';
import { CollectionItemsController } from './collection-items.controller';
import { CollectionItemsService } from './collection-items.service';
import { AuthGuard } from '../models/auth/auth.guard';

describe('CollectionItemsController', () => {
  let controller: CollectionItemsController;
  const collectionItemsServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionItemsController],
      providers: [
        {
          provide: CollectionItemsService,
          useValue: collectionItemsServiceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<CollectionItemsController>(
      CollectionItemsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
