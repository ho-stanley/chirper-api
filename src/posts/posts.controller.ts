import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/utils/typings/request-user';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: RequestWithUser) {
    const { id, username } = req.user;

    return this.postsService.create({
      author: { connect: { id } },
      authorName: username,
      ...createPostDto,
    });
  }

  @Get()
  findAll(@Query() query: FindPostsQueryDto) {
    const { limit, userId, keyword } = query;

    return this.postsService.findAll({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        AND: [
          {
            authorId: userId,
          },
          {
            OR: [
              {
                title: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
              {
                body: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
      },
      take: limit,
    });
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('comments') includeComments?: boolean,
  ) {
    return this.postsService.findOne(
      { id },
      { comments: includeComments && { orderBy: { createdAt: 'desc' } } },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.postsService.remove({ id }, req.user);
  }
}
