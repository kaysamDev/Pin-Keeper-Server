import { Module } from '@nestjs/common';
import { LocationTagsService } from './location-tags.service';
import { LocationTagsController } from './location-tags.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [LocationTagsController],
  providers: [LocationTagsService, PrismaService],
})
export class LocationTagsModule {}
