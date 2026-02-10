import { ApiProperty } from '@nestjs/swagger';

export class CreateCollectionDto {
  @ApiProperty({ description: 'name of the collection', example: 'My Pins' })
  name: string;

  @ApiProperty({
    description: 'description of the collection',
    example: 'Collection of my favorite pins',
  })
  description: string;

  @ApiProperty({
    description: 'user ID who owns the collection',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'whether the collection is public',
    example: false,
    required: false,
  })
  isPublic?: boolean;
}
