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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/utils/typings/request-user';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('posts/:postId/comments')
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.commentsService.create(createCommentDto, postId, req.user);
  }

  @Get('posts/:postId/comments')
  findAllByPostId(@Param('postId') postId: string) {
    return this.commentsService.findAllByPostId(postId);
  }

  @Get('comments/:id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne({ id });
  }

  @Patch('comments/:postId')
  update(
    @Param('postId') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete('comments/:postId')
  remove(@Param('postId') id: string) {
    return this.commentsService.remove(+id);
  }
}
