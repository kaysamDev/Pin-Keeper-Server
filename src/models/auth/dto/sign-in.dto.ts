import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    example: 'example@mail.com',
    description: 'The email of the user',
  })
  email: string;

  @ApiProperty({ example: 'password', description: 'The password of the user' })
  password: string;
}
