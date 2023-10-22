import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({ enum: Role, enumName: 'Role' })
  @IsEnum(Role, { message: 'Invalid role' })
  role: Role;
}
