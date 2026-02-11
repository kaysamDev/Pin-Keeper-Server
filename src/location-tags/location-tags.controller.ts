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
import { LocationTagsService } from './location-tags.service';
import { LocationTags } from '../../generated/prisma/client';
import { CreateLocationTagDto } from './dto/create-location-tag.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../models/auth/auth.guard';

@ApiTags('location-tags')
@ApiBearerAuth()
@Controller('location-tags')
@UseGuards(AuthGuard)
export class LocationTagsController {
  constructor(private readonly locationTagsService: LocationTagsService) {}

  @ApiOperation({ summary: 'Get all location tags' })
  @ApiResponse({ status: 200, description: 'Location Tags Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getLocationTags(): Promise<LocationTags[] | null> {
    return await this.locationTagsService.getLocationTags({});
  }

  @ApiOperation({
    summary: 'Get location tag by composite ID (locationId and tagId)',
  })
  @ApiResponse({ status: 200, description: 'Location Tag Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get(':locationId/:tagId')
  async getLocationTagById(
    @Param('locationId') locationId: string,
    @Param('tagId') tagId: string,
  ): Promise<LocationTags | null> {
    return await this.locationTagsService.getLocationTag({
      locationId_tagId: {
        locationId: Number(locationId),
        tagId: Number(tagId),
      },
    });
  }

  @ApiOperation({ summary: 'Get all tags for a specific location' })
  @ApiResponse({ status: 200, description: 'Location Tags Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('location/:locationId')
  async getLocationTagsByLocationId(
    @Param('locationId') locationId: string,
  ): Promise<LocationTags[] | null> {
    return await this.locationTagsService.getLocationTagsByLocationId(
      Number(locationId),
    );
  }

  @ApiOperation({ summary: 'Get all locations for a specific tag' })
  @ApiResponse({ status: 200, description: 'Location Tags Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('tag/:tagId')
  async getLocationTagsByTagId(
    @Param('tagId') tagId: string,
  ): Promise<LocationTags[] | null> {
    return await this.locationTagsService.getLocationTagsByTagId(Number(tagId));
  }

  @ApiOperation({ summary: 'Create location tag' })
  @ApiResponse({ status: 201, description: 'Location Tag Created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createLocationTag(@Body() createLocationTagDto: CreateLocationTagDto) {
    const { tagId, locationId } = createLocationTagDto;
    return this.locationTagsService.createLocationTag({
      tag: {
        connect: { id: tagId },
      },
      location: {
        connect: { id: locationId },
      },
    });
  }

  @ApiOperation({ summary: 'Delete location tag by composite ID' })
  @ApiResponse({
    status: 200,
    description: 'Location Tag deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Delete(':locationId/:tagId')
  async deleteLocationTag(
    @Param('locationId') locationId: string,
    @Param('tagId') tagId: string,
  ): Promise<LocationTags> {
    return this.locationTagsService.deleteLocationTag({
      locationId_tagId: {
        locationId: Number(locationId),
        tagId: Number(tagId),
      },
    });
  }
}
