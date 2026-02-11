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
import { CategoriesService } from './categories.service';
import { Categories } from 'generated/prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../models/auth/auth.guard';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Categories Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getCategories(): Promise<Categories[] | null> {
    return await this.categoriesService.getCategories({});
  }

  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('category/:id')
  async getCategoryById(@Param('id') id: string): Promise<Categories | null> {
    return await this.categoriesService.getCategory({ id: Number(id) });
  }

  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 201, description: 'Category Created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const { name, Locations } = createCategoryDto;
    return this.categoriesService.createCategory({
      name,
      Locations: {
        connect: Locations?.map((i) => ({ id: i.id })) || [],
      },
    });
  }

  @ApiOperation({ summary: 'Update category by ID' })
  @ApiResponse({ status: 200, description: 'Category Updated Successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Put('category/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Categories> {
    const { name, Locations } = updateCategoryDto;

    return this.categoriesService.updateCategory({
      where: { id: Number(id) },
      data: {
        name,
        Locations: {
          set: Locations?.map((i) => ({ id: i.id })) || [],
        },
      },
    });
  }

  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Delete('category/:id')
  async deleteCategory(@Param('id') id: string): Promise<Categories> {
    return this.categoriesService.deleteCategory({ id: Number(id) });
  }
}
