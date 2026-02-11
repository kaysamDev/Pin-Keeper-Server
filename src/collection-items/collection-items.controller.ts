import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CollectionItemsService } from './collection-items.service';
import { CollectionItems } from 'generated/prisma/client';
import { CreateCollectionItemDto } from './dto/create-collection-item.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../models/auth/auth.guard';

@ApiTags('collection-items')
@ApiBearerAuth()
@Controller('collection-items')
@UseGuards(AuthGuard)
export class CollectionItemsController {
  constructor(
    private readonly collectionItemsService: CollectionItemsService,
  ) {}

  @ApiOperation({ summary: 'Get all collection items' })
  @ApiResponse({ status: 200, description: 'Collection Items Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getCollectionItems(): Promise<CollectionItems[] | null> {
    return await this.collectionItemsService.getCollectionItems({});
  }

  @ApiOperation({
    summary:
      'Get collection item by composite ID (collectionId and locationId)',
  })
  @ApiResponse({ status: 200, description: 'Collection Item Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get(':collectionId/:locationId')
  async getCollectionItemById(
    @Param('collectionId') collectionId: string,
    @Param('locationId') locationId: string,
  ): Promise<CollectionItems | null> {
    return await this.collectionItemsService.getCollectionItem({
      collectionId_locationId: {
        collectionId: Number(collectionId),
        locationId: Number(locationId),
      },
    });
  }

  @ApiOperation({ summary: 'Get all items for a specific collection' })
  @ApiResponse({ status: 200, description: 'Collection Items Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('collection/:collectionId')
  async getCollectionItemsByCollectionId(
    @Param('collectionId') collectionId: string,
  ): Promise<CollectionItems[] | null> {
    return await this.collectionItemsService.getCollectionItemsByCollectionId(
      Number(collectionId),
    );
  }

  @ApiOperation({ summary: 'Get all collections for a specific location' })
  @ApiResponse({ status: 200, description: 'Collection Items Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('location/:locationId')
  async getCollectionItemsByLocationId(
    @Param('locationId') locationId: string,
  ): Promise<CollectionItems[] | null> {
    return await this.collectionItemsService.getCollectionItemsByLocationId(
      Number(locationId),
    );
  }

  @ApiOperation({ summary: 'Create collection item' })
  @ApiResponse({ status: 201, description: 'Collection Item Created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCollectionItem(
    @Body() createCollectionItemDto: CreateCollectionItemDto,
  ) {
    const { collectionId, locationId } = createCollectionItemDto;
    return this.collectionItemsService.createCollectionItem({
      collection: {
        connect: { id: collectionId },
      },
      location: {
        connect: { id: locationId },
      },
    });
  }

  @ApiOperation({ summary: 'Delete collection item by composite ID' })
  @ApiResponse({
    status: 200,
    description: 'Collection Item deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Delete(':collectionId/:locationId')
  async deleteCollectionItem(
    @Param('collectionId') collectionId: string,
    @Param('locationId') locationId: string,
  ): Promise<CollectionItems> {
    return this.collectionItemsService.deleteCollectionItem({
      collectionId_locationId: {
        collectionId: Number(collectionId),
        locationId: Number(locationId),
      },
    });
  }
}
