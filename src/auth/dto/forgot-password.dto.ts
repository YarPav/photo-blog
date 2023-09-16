import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    default: 'test@gmail.com',
  })
  email: string;
}
