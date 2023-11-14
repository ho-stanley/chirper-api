import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindPostsQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsNumber({ allowNaN: false })
  @Type(() => Number)
  limit: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  keyword: string;
}
