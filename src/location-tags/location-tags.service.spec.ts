import { Test, TestingModule } from '@nestjs/testing';
import { LocationTagsService } from './location-tags.service';
import { it } from 'node:test';

describe('LocationTagsService', () => {
  let service: LocationTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationTagsService],
    }).compile();

    service = module.get<LocationTagsService>(LocationTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

// it
