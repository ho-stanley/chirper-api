import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Matches(/^\w+$/, {
    message: 'Only A-Z letters, numbers and underscore are allowed',
  })
  @MinLength(3)
  @MaxLength(25)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(250)
  password: string;

  @IsString()
  @MinLength(8)
  @MaxLength(250)
  repeatPassword: string;
}
