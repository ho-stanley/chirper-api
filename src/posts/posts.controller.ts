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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/utils/typings/request-user';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PostDto } from './dto/post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PostDto })
  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: RequestWithUser,
  ): Promise<PostDto> {
    const { id, username } = req.user;

    return this.postsService.create({
      author: { connect: { id } },
      authorName: username,
      ...createPostDto,
    });
  }

  @Get()
  @ApiOkResponse({ type: [PostDto] })
  findAll(@Query() query: FindPostsQueryDto): Promise<PostDto[]> {
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
  @ApiOkResponse({ type: PostDto })
  @ApiQuery({ name: 'comments', required: false })
  findOne(
    @Param('id') id: string,
    @Query('comments') includeComments?: boolean,
  ): Promise<PostDto | null> {
    return this.postsService.findOne(
      { id },
      { comments: includeComments && { orderBy: { createdAt: 'desc' } } },
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOkResponse({ type: PostDto })
  remove(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<PostDto> {
    return this.postsService.remove({ id }, req.user);
  }
}
