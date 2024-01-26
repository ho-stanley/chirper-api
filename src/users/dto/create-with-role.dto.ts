import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWithRoleDto extends CreateUserDto {
  @ApiProperty({ enum: Role, enumName: 'Role' })
  @IsEnum(Role, { message: 'Invalid role' })
  role: Role;
}
