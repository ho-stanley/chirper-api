import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';

export class PostDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  authorName: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: Date, nullable: true })
  updatedAt: Date | null;

  @ApiProperty({ type: [CommentDto], nullable: true })
  comments?: CommentDto[];
}