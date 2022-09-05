import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  title: string;

  @IsString()
  @MinLength(1)
  @MaxLength(250)
  body: string;
}
