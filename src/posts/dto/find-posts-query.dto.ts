import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindPostsQueryDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber({ allowNaN: false })
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  keyword: string;
}
