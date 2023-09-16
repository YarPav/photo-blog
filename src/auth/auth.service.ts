import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserEntity } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenEntity } from './entities/token.entity';
import { Repository } from 'typeorm';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectRepository(TokenEntity)
    private tokenRepository: Repository<TokenEntity>,
  ) {}

  private EMAIL_SUBJECT = 'Reset password';

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(pass, user.password);

      if (isPasswordCorrect) {
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async register(createUserDto: CreateUserDto) {
    try {
      let user = await this.usersService.findByEmail(createUserDto.email);

      if (user) {
        return new BadRequestException(
          null,
          'User with this email already exists',
        );
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      user = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
      });

      return {
        token: this.jwtService.sign({ id: user.id }),
      };
    } catch (e) {
      console.log(e);
      throw new ForbiddenException('Registration error');
    }
  }

  async login(user: UserEntity) {
    const payload = { id: user.id };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    try {
      const user = await this.usersService.findByEmail(forgotPasswordDto.email);

      if (!user) {
        return new BadRequestException('User with this email is not exists');
      }

      const payload = { email: user.email };
      const token = this.jwtService.sign(payload);
      await this.registerToken(token);

      const RESET_PASSWORD_LINK = `${process.env.FRONTEND_HOST}/${process.env.FRONTEND_FORGOT_PASSWORD_PATH}?${token}`;
      await this.emailService.sendEmail({
        to: user.email,
        subject: this.EMAIL_SUBJECT,
        html: `<span>To reset password click at this link - <a href="${RESET_PASSWORD_LINK}">${RESET_PASSWORD_LINK}</a></span>`,
      });
      console.log(token);
      return new HttpException('success', HttpStatus.OK);
    } catch (e) {
      return new InternalServerErrorException('Error while generating token');
    }
  }

  async verifyForgotPassword(token: string) {
    const email = await this.getEmailFromToken(token);
    return new HttpException(JSON.stringify(email), HttpStatus.OK);
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { newPassword, token } = changePasswordDto;
    const email = await this.getEmailFromToken(token);
    const updateUserDto = new UpdateUserDto();
    updateUserDto.password = await bcrypt.hash(newPassword, 10);
    await this.removeToken(token);
    return await this.usersService.changePasswordByEmail(email, updateUserDto);
  }

  private async getEmailFromToken(token: string) {
    return await this.jwtService.decode(token)['email'];
  }

  async registerToken(token: string) {
    return await this.tokenRepository.save({
      token,
    });
  }

  async removeToken(token: string) {
    return await this.tokenRepository.delete({
      token,
    });
  }

  async findToken(token: string) {
    return await this.tokenRepository.findOneBy({
      token,
    });
  }
}
