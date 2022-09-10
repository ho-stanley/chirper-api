import { BadRequestException, Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
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

  async findOne(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    const post = await this.prismaService.post
      .findUnique({
        where: postWhereUniqueInput,
      })
      .catch(() => {
        /**
         * Prisma query will throw an error on malformed ObjectID
         * and needs to be handled.
         */
        throw new BadRequestException('Post does not exist');
      });
    return post;
  }

  async remove(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post> {
    const removedPost = await this.prismaService.post
      .delete({
        where: postWhereUniqueInput,
      })
      .catch(() => {
        throw new BadRequestException('Post does not exist');
      });
    return removedPost;
  }
}
