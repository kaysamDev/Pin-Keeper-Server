import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationTagDto {
  @ApiProperty({ description: 'ID of the tag', example: 1 })
  tagId: number;

  @ApiProperty({ description: 'ID of the location', example: 1 })
  locationId: number;
}
