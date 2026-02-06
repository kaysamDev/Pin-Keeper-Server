import { ApiProperty } from '@nestjs/swagger';
import { CreateLocationDto } from '../../locations/dto/create-location.dto';

export class CreateCategoryDto {
  @ApiProperty({ description: 'name of the category', example: 'name' })
  name: string;

  @ApiProperty({
    description: 'locations for the category',
    type: [CreateLocationDto],
    required: false,
  })
  Locations?: CreateLocationDto[];
}
