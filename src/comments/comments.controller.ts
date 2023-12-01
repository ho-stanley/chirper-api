import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/utils/typings/request-user';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentDto } from './dto/comment.dto';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiTags('posts')
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CommentDto })
  @Post('posts/:postId/comments')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @Req() req: RequestWithUser,
  ): Promise<CommentDto> {
    const { id, username } = req.user;

    return this.commentsService.create({
      author: { connect: { id } },
      authorName: username,
      post: { connect: { id: postId } },
      ...createCommentDto,
    });
  }

  @Get('posts/:postId/comments')
  @ApiTags('posts')
  @ApiOkResponse({ type: [CommentDto] })
  findAllByPostId(@Param('postId') postId: string): Promise<CommentDto[]> {
    return this.commentsService.findAllByPostId({ postId });
  }

  @Get('comments/:id')
  @ApiTags('comments')
  @ApiOkResponse({ type: CommentDto })
  findOne(@Param('id') id: string): Promise<CommentDto | null> {
    return this.commentsService.findOne({ id });
  }

  @UseGuards(JwtAuthGuard)
  @ApiTags('comments')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentDto })
  @Patch('comments/:id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: RequestWithUser,
  ): Promise<CommentDto> {
    return this.commentsService.update(
      { ...updateCommentDto },
      { id },
      req.user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiTags('comments')
  @ApiBearerAuth()
  @ApiOkResponse({ type: CommentDto })
  @Delete('comments/:postId')
  remove(
    @Param('postId') id: string,
    @Req() req: RequestWithUser,
  ): Promise<CommentDto> {
    return this.commentsService.remove({ id }, req.user);
  }
}
