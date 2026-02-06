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
import { TagsService } from './tags.service';
import { Tags } from '../../generated/prisma/client';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'Tags Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('tags')
  async getTags(): Promise<Tags[] | null> {
    return await this.tagsService.getTags({});
  }

  @ApiOperation({ summary: 'Get tag by ID' })
  @ApiResponse({ status: 200, description: 'Tag Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('tag/:id')
  async getTagById(@Param('id') id: string): Promise<Tags | null> {
    return await this.tagsService.getTag({ id: Number(id) });
  }

  @ApiOperation({ summary: 'Create tag' })
  @ApiResponse({ status: 201, description: 'Tag Created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  @Post('tag')
  async createTag(@Body() createTagDto: CreateTagDto) {
    const { name, locationIds } = createTagDto;
    return this.tagsService.createTag({
      name,
      LocationTags: {
        create:
          locationIds?.map((locationId) => ({
            location: {
              connect: { id: locationId },
            },
          })) || [],
      },
    });
  }

  @ApiOperation({ summary: 'Update tag by ID' })
  @ApiResponse({ status: 200, description: 'Tag Updated Successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Put('tag/:id')
  async updateTag(
    @Param('id') id: string,
    @Body() updateTagDto: UpdateTagDto,
  ): Promise<Tags> {
    const { name, locationIds } = updateTagDto;

    return this.tagsService.updateTag({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(locationIds && {
          LocationTags: {
            deleteMany: {},
            create: locationIds.map((locationId) => ({
              location: {
                connect: { id: locationId },
              },
            })),
          },
        }),
      },
    });
  }

  @ApiOperation({ summary: 'Delete tag by ID' })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Delete('tag/:id')
  async deleteTag(@Param('id') id: string): Promise<Tags> {
    return this.tagsService.deleteTag({ id: Number(id) });
  }
}
