import { Test, TestingModule } from '@nestjs/testing';
import { LocationTagsController } from './location-tags.controller';
import { LocationTagsService } from './location-tags.service';

describe('LocationTagsController', () => {
  let controller: LocationTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationTagsController],
      providers: [LocationTagsService],
    }).compile();

    controller = module.get<LocationTagsController>(LocationTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
