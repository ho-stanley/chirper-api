import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(25)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(250)
  password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(250)
  repeatPassword: string;
}
