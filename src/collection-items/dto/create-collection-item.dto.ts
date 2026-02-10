import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectionItemDto {
  @ApiProperty({ description: 'ID of the collection', example: 1 })
  collectionId: number;

  @ApiProperty({ description: 'ID of the location', example: 1 })
  locationId: number;
}
