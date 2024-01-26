import { subject } from '@casl/ability';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/utils/enums/action.enum';
import { prismaQueryError } from 'src/utils/error-handler';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { PublicUser } from 'src/utils/typings/public-user';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async create(postCreateInput: Prisma.PostCreateInput): Promise<PostDto> {
    const createdPost = await this.prismaService.post.create({
      data: postCreateInput,
    });

    return createdPost;
  }

  async findAll(postFindManyArgs: Prisma.PostFindManyArgs): Promise<PostDto[]> {
    const posts = await this.prismaService.post.findMany(postFindManyArgs);

    return posts;
  }

  async findOne(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
    postInclude: Prisma.PostInclude,
  ): Promise<PostDto | null> {
    const post = await this.prismaService.post
      .findUnique({
        where: postWhereUniqueInput,
        include: postInclude,
      })
      .catch(prismaQueryError);

    return post;
  }

  async remove(
    postWhereUniqueInput: Prisma.PostWhereUniqueInput,
    user: PublicUser,
  ): Promise<PostDto> {
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
