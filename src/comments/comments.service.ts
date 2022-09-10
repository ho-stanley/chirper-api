import { BadRequestException, Injectable } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { JwtData } from 'src/utils/typings/request-jwt';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createCommentDto: CreateCommentDto,
    postId: string,
    jwtData: JwtData,
  ): Promise<Comment> {
    const { body } = createCommentDto;
    const { id, username } = jwtData;
    const createdComment = await this.prismaService.post
      .update({
        where: {
          id: postId,
        },
        data: {
          comments: {
            create: {
              authorId: id,
              authorName: username,
              body,
            },
          },
        },
      })
      .comments({
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      })
      .catch(() => {
        throw new BadRequestException('Post does not exist');
      });
    return createdComment[0];
  }

  findAllByPostId(postId: string): Promise<Comment[]> {
    return this.prismaService.comment
      .findMany({
        where: {
          postId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
      .catch(() => {
        throw new BadRequestException('Post does not exist');
      });
  }

  async findOne(
    commentWhereUniqueInput: Prisma.CommentWhereUniqueInput,
  ): Promise<Comment | null> {
    return this.prismaService.comment
      .findUnique({
        where: commentWhereUniqueInput,
      })
      .catch(() => {
        throw new BadRequestException('Comment does not exist');
      });
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
