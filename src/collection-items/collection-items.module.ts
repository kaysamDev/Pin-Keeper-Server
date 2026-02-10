import { Module } from '@nestjs/common';
import { CollectionItemsService } from './collection-items.service';
import { CollectionItemsController } from './collection-items.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [CollectionItemsController],
  providers: [CollectionItemsService, PrismaService],
})
export class CollectionItemsModule {}
