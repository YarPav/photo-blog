import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostEntity } from './entities/post.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostsService {
  private supplyUser = {
    select: {
      user: {
        id: true,
        name: true,
      },
    },
    relations: {
      user: true,
    },
  };
  constructor(
    @InjectRepository(PostEntity) private repository: Repository<PostEntity>,
  ) {}
  create(createPostDto: CreatePostDto, userId: number) {
    return this.repository.save({
      ...createPostDto,
      user: { id: userId },
    });
  }

  findAll() {
    return this.repository.find(this.supplyUser);
  }

  async findOne(id: number) {
    const post = await this.repository.findOne({
      where: { id },
      ...this.supplyUser,
    });
    return post || new BadRequestException(null, 'Post with this id not found');
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const updatedPost = await this.repository.findOne({
      where: { id },
      ...this.supplyUser,
    });

    if (!updatedPost) {
      return new BadRequestException(null, 'Post with this id not found');
    }

    return this.repository.save({
      ...updatedPost,
      ...updatePostDto,
    });
  }

  async remove(id: number) {
    const deletedPost = await this.repository.delete(id);

    if (deletedPost.affected > 0) {
      return new HttpException('Post has been deleted', HttpStatus.OK);
    }

    return new BadRequestException(null, 'Post with this id not found');
  }
}
