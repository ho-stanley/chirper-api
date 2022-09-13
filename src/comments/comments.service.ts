import { subject } from '@casl/ability';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Comment, Prisma } from '@prisma/client';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/utils/enums/action.enum';
import { prismaQueryError } from 'src/utils/error-handler';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { PublicUser } from 'src/utils/typings/public-user';

@Injectable()
export class CommentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async create(
    commentCreateInput: Prisma.CommentCreateInput,
  ): Promise<Comment> {
    const createdComment = await this.prismaService.comment
      .create({
        data: commentCreateInput,
      })
      .catch(prismaQueryError);

    return createdComment;
  }

  async findAllByPostId(
    commentWhereInput: Prisma.CommentWhereInput,
  ): Promise<Comment[]> {
    return this.prismaService.comment
      .findMany({
        where: commentWhereInput,
        orderBy: {
          createdAt: 'desc',
        },
      })
      .catch(prismaQueryError);
  }

  async findOne(
    commentWhereUniqueInput: Prisma.CommentWhereUniqueInput,
  ): Promise<Comment | null> {
    const comment = await this.prismaService.comment
      .findUnique({
        where: commentWhereUniqueInput,
      })
      .catch(prismaQueryError);

    return comment;
  }

  async update(
    commentUpdateInput: Prisma.CommentUpdateInput,
    commentWhereUniqueInput: Prisma.CommentWhereUniqueInput,
    user: PublicUser,
  ): Promise<Comment> {
    const commentToUpdate = await this.prismaService.comment.findUniqueOrThrow({
      where: commentWhereUniqueInput,
    });
    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.cannot(Action.Update, subject('Comment', commentToUpdate))) {
      throw new ForbiddenException();
    }

    const updatedComment = await this.prismaService.comment
      .update({
        where: commentWhereUniqueInput,
        data: {
          updatedAt: new Date(),
          ...commentUpdateInput,
        },
      })
      .catch(prismaQueryError);

    return updatedComment;
  }

  async remove(
    commentWhereUniqueInput: Prisma.CommentWhereUniqueInput,
    user: PublicUser,
  ): Promise<Comment> {
    const commentToRemove = await this.prismaService.comment
      .findUniqueOrThrow({
        where: commentWhereUniqueInput,
      })
      .catch(prismaQueryError);
    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.cannot(Action.Delete, subject('Comment', commentToRemove)))
      throw new ForbiddenException();

    const removedComment = await this.prismaService.comment
      .delete({
        where: commentWhereUniqueInput,
      })
      .catch(prismaQueryError);

    return removedComment;
  }
}
