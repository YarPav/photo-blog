import { UserEntity } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    default: 'somepath',
  })
  filePath: string;

  @ApiProperty({
    default: 'Some file',
  })
  description: string;

  @ApiProperty({
    default: 1,
  })
  user: UserEntity;
}
