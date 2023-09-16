import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repository: Repository<UserEntity>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    return this.repository.save(createUserDto);
  }

  async findByEmail(email: string) {
    return this.repository.findOneBy({
      email,
    });
  }

  async findById(id: number) {
    return this.repository.findOne({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async changePassword(user, newPassword: UpdateUserDto) {
    const changedUser = await this.repository.update(
      { id: user.id },
      newPassword,
    );

    if (changedUser.affected > 0) {
      return new HttpException('Password has been changed', HttpStatus.OK);
    }
  }

  async changePasswordByEmail(email: string, newPassword: UpdateUserDto) {
    const user = await this.findByEmail(email);
    return await this.changePassword(user, newPassword);
  }
}
