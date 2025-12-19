import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'philip', description: 'The username of the user' })
  username: string;

  @ApiProperty({ example: 'changeme', description: 'The password of the user' })
  password: string;
}
