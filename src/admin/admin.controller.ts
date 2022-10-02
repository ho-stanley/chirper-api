import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateWithRoleDto } from 'src/users/dto/create-with-role.dto';
import { UsersService } from 'src/users/users.service';
import { RequestWithUser } from 'src/utils/typings/request-user';

@Controller('admin')
export class AdminController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Post('users')
  async create(
    @Body() createWithRoleDto: CreateWithRoleDto,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.createWithRole(createWithRoleDto, req.user);
  }
}
