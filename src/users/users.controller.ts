import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PublicUser } from 'src/utils/typings/public-user';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/utils/typings/request-user';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  findOne(@Param('username') username: string): Promise<PublicUser | null> {
    return this.usersService.findOne({ username });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':username')
  update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.update({ username }, updateUserDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':username/role')
  updateRole(
    @Param('username') username: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Req() req: RequestWithUser,
  ) {
    return this.usersService.updateRole(
      { username },
      updateUserRoleDto.role,
      req.user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':username')
  remove(@Param('username') username: string, @Req() req: RequestWithUser) {
    return this.usersService.remove({ username }, req.user);
  }
}
