import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Only A-Z letters, numbers and underscore are allowed',
    minLength: 3,
    maxLength: 25,
  })
  @IsString()
  @Matches(/^\w+$/, {
    message: 'Only A-Z letters, numbers and underscore are allowed',
  })
  @MinLength(3)
  @MaxLength(25)
  username: string;

  @ApiProperty({ minLength: 8, maxLength: 250 })
  @IsString()
  @MinLength(8)
  @MaxLength(250)
  password: string;

  @ApiProperty({ minLength: 8, maxLength: 250 })
  @IsString()
  @MinLength(8)
  @MaxLength(250)
  repeatPassword: string;
}
