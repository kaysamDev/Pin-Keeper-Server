import {
  Controller,
  Body,
  Get,
  Param,
  Post,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Locations } from '../../generated/prisma/client';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@ApiTags('locations')
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @ApiOperation({ summary: 'Get location by ID' })
  @ApiResponse({ status: 200, description: 'User Location Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get('location/:id')
  async getLocationById(@Param('id') id: string): Promise<Locations | null> {
    return this.locationsService.location({ id: Number(id) });
  }

  @ApiOperation({ summary: 'Get all locations' })
  @ApiResponse({ status: 200, description: 'User Locations Found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAllLocations(): Promise<Locations[] | null> {
    return this.locationsService.locations({});
  }

  @ApiOperation({ summary: 'Create location' })
  @ApiResponse({ status: 200, description: 'Location Created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createLocation(@Body() createLocationDto: CreateLocationDto) {
    const { userId, categoryId, ...locationData } = createLocationDto;
    return this.locationsService.createLocation({
      ...locationData,
      user: {
        connect: { id: userId },
      },
      ...(categoryId && {
        category: {
          connect: { id: categoryId },
        },
      }),
    });
  }

  @ApiOperation({ summary: 'Update location by ID' })
  @ApiResponse({
    status: 200,
    description: 'User Location Updated Successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Put('location/:id')
  async updateLocation(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Locations> {
    const { userId, categoryId, ...locationData } = updateLocationDto;

    return this.locationsService.updateLocation({
      where: { id: Number(id) },
      data: {
        ...locationData,
        ...(userId && {
          user: {
            connect: { id: userId },
          },
        }),
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),
      },
    });
  }

  @ApiOperation({ summary: 'Delete location by ID' })
  @ApiResponse({ status: 200, description: 'User deleted succefully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  @Delete('location/:id')
  async deleteLocation(@Param('id') id: string): Promise<Locations> {
    return this.locationsService.deleteLocation({ id: Number(id) });
  }
}
