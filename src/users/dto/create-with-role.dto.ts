import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class CreateWithRoleDto extends CreateUserDto {
  @IsEnum(Role, { message: 'Invalid role' })
  role: Role;
}
