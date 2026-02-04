import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty({
    example: 'example@mail.com',
    description: 'Your new email address',
  })
  email: string;

  @ApiProperty({ example: 'password', description: 'Your new password' })
  password: string;
}
