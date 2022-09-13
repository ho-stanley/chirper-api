import { subject } from '@casl/ability';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/utils/enums/action.enum';
import { prismaQueryError } from 'src/utils/error-handler';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { PublicUser } from 'src/utils/typings/public-user';

@Injectable()
export class PostsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async create(postCreateInput: Prisma.PostCreateInput): Promise<Post> {
    const createdPost = await this.prismaService.post.create({
      data: postCreateInput,
    });

    return createdPost;
  }

  async findAll(): Promise<Post[]> {
    return this.prismaService.post.findMany();
  }

  async findOne(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
  ): Promise<Post | null> {
    const post = await this.prismaService.post
      .findUnique({
        where: postWhereUniqueInput,
      })
      .catch(prismaQueryError);

    return post;
  }

  async remove(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
    user: PublicUser,
  ): Promise<Post> {
    const postToRemove = await this.prismaService.post
      .findUniqueOrThrow({
        where: postWhereUniqueInput,
      })
      .catch(prismaQueryError);
    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.cannot(Action.Delete, subject('Post', postToRemove)))
      throw new ForbiddenException();

    const removedPost = await this.prismaService.post
      .delete({
        where: postWhereUniqueInput,
      })
      .catch(prismaQueryError);

    return removedPost;
  }
}
