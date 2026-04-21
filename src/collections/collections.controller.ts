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
  UseGuards,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../models/auth/auth.guard';

@ApiTags('collections')
@ApiBearerAuth()
@Controller('collections')
@UseGuards(AuthGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @ApiOperation({ summary: 'Get all collections' })
  @ApiResponse({ status: 200, description: 'Collections Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getCollections(): ReturnType<CollectionsService['getCollections']> {
    return await this.collectionsService.getCollections({});
  }

  @ApiOperation({ summary: 'Get collection by ID' })
  @ApiResponse({ status: 200, description: 'Collection Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('collection/:id')
  async getCollectionById(
    @Param('id') id: string,
  ): ReturnType<CollectionsService['getCollection']> {
    return await this.collectionsService.getCollection({ id: Number(id) });
  }

  @ApiOperation({ summary: 'Get collections by user ID' })
  @ApiResponse({ status: 200, description: 'Collections Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('user/:userId')
  async getCollectionsByUserId(
    @Param('userId') userId: string,
  ): ReturnType<CollectionsService['getCollections']> {
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
  ): ReturnType<CollectionsService['updateCollection']> {
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
  async deleteCollection(
    @Param('id') id: string,
  ): ReturnType<CollectionsService['deleteCollection']> {
    return this.collectionsService.deleteCollection({ id: Number(id) });
  }
}
