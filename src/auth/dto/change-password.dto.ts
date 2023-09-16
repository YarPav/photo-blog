import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    default: 'some password',
  })
  newPassword: string;

  @ApiProperty({
    default: 'some token',
  })
  token: string;
}
