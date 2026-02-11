import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityLogDto {
  @ApiProperty({ description: 'ID of the user', example: 1 })
  userId: number;

  @ApiProperty({ description: 'Action performed', example: 'LOGIN' })
  action: string;

  @ApiProperty({
    description: 'Additional metadata as JSON',
    example: { ip: '127.0.0.1', userAgent: 'Mozilla/5.0' },
  })
  metadata: object;
}
