import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    default: 'test@gmail.com',
  })
  email: string;

  @ApiProperty({
    default: 'Tester',
  })
  name: string;

  @ApiProperty({
    default: 'testPassword',
  })
  password: string;
}
