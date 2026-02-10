import { Test, TestingModule } from '@nestjs/testing';
import { CollectionItemsController } from './collection-items.controller';
import { CollectionItemsService } from './collection-items.service';

describe('CollectionItemsController', () => {
  let controller: CollectionItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionItemsController],
      providers: [CollectionItemsService],
    }).compile();

    controller = module.get<CollectionItemsController>(
      CollectionItemsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
