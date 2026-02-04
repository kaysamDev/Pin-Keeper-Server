import {
  IsString,
  IsOptional,
  IsInt,
  IsLatitude,
  IsLongitude,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ description: 'The ID of the user who owns this location' })
  @IsInt()
  userId: number;

  @ApiProperty({ description: 'The title of the location' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Optional description of the location' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Latitude coordinate', example: 40.7128 })
  @IsLatitude()
  latitude: number;

  @ApiProperty({ description: 'Longitude coordinate', example: -74.006 })
  @IsLongitude()
  longitude: number;

  @ApiProperty({ description: 'Address of the location' })
  @IsString()
  address: string;

  @ApiPropertyOptional({ description: 'Optional category ID for the location' })
  @IsInt()
  @IsOptional()
  categoryId?: number;
}
