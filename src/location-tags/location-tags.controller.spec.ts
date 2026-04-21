import { Test, TestingModule } from '@nestjs/testing';
import { LocationTagsController } from './location-tags.controller';
import { LocationTagsService } from './location-tags.service';
import { AuthGuard } from '../models/auth/auth.guard';

describe('LocationTagsController', () => {
  let controller: LocationTagsController;
  const locationTagsServiceMock = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationTagsController],
      providers: [
        {
          provide: LocationTagsService,
          useValue: locationTagsServiceMock,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<LocationTagsController>(LocationTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
