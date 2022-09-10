import { BadRequestException, Injectable } from '@nestjs/common';
import { Post } from '@prisma/client';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { JwtData } from 'src/utils/typings/request-jwt';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPostDto: CreatePostDto, user: JwtData): Promise<Post> {
    const post = await this.prismaService.post.create({
      data: {
        authorId: user.id,
        authorName: user.username,
        ...createPostDto,
      },
    });
    return post;
  }

  findAll(): Promise<Post[]> {
    return this.prismaService.post.findMany();
  }

  async findOne(id: string): Promise<Post | null> {
    const post = await this.prismaService.post
      .findUnique({
        where: {
          id,
        },
      })
      .catch(() => {
        /**
         * Prisma query will throw an error on malformed ObjectID
         * and needs to be handled.
         */
        throw new BadRequestException();
      });
    return post;
  }

  async remove(id: string) {
    const removedPost = await this.prismaService.post
      .delete({
        where: {
          id,
        },
      })
      .catch(() => {
        throw new BadRequestException('Post does not exist');
      });
    return removedPost;
  }
}
