import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { Collections } from '../../generated/prisma/client';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('collections')
@Controller('collections')
export class CollectionsController {
  constructor(private collectionsService: CollectionsService) {}

  @ApiOperation({ summary: 'Get all collections' })
  @ApiResponse({ status: 200, description: 'Collections Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getCollections(): Promise<Collections[] | null> {
    return await this.collectionsService.getCollections({});
  }

  @ApiOperation({ summary: 'Get collection by ID' })
  @ApiResponse({ status: 200, description: 'Collection Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('collection/:id')
  async getCollectionById(
    @Param('id') id: string,
  ): Promise<Collections | null> {
    return await this.collectionsService.getCollection({ id: Number(id) });
  }

  @ApiOperation({ summary: 'Get collections by user ID' })
  @ApiResponse({ status: 200, description: 'Collections Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('user/:userId')
  async getCollectionsByUserId(
    @Param('userId') userId: string,
  ): Promise<Collections[] | null> {
    return await this.collectionsService.getCollections({
      where: { userId: Number(userId) },
    });
  }

  @ApiOperation({ summary: 'Create collection' })
  @ApiResponse({ status: 201, description: 'Collection Created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCollection(@Body() createCollectionDto: CreateCollectionDto) {
    const { name, description, userId, isPublic } = createCollectionDto;
    return this.collectionsService.createCollection({
      name,
      description,
      isPublic: isPublic ?? false,
      user: {
        connect: { id: userId },
      },
    });
  }

  @ApiOperation({ summary: 'Update collection by ID' })
  @ApiResponse({ status: 200, description: 'Collection Updated Successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Put('collection/:id')
  async updateCollection(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ): Promise<Collections> {
    const { name, description, userId, isPublic } = updateCollectionDto;

    return this.collectionsService.updateCollection({
      where: { id: Number(id) },
      data: {
        name,
        description,
        isPublic,
        ...(userId && {
          user: {
            connect: { id: userId },
          },
        }),
      },
    });
  }

  @ApiOperation({ summary: 'Delete collection by ID' })
  @ApiResponse({ status: 200, description: 'Collection deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Delete('collection/:id')
  async deleteCollection(@Param('id') id: string): Promise<Collections> {
    return this.collectionsService.deleteCollection({ id: Number(id) });
  }
}
