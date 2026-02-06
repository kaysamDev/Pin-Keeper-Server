import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ description: 'Name of the tag', example: 'Restaurant' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description: 'Array of location IDs to associate with this tag',
    type: [Number],
    example: [1, 2, 3],
  })
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  locationIds?: number[];
}
