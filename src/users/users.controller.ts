import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PublicUser } from 'src/utils/typings/public-user';
import { Roles } from 'src/utils/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { Role } from '@prisma/client';
import { UserGuard } from 'src/utils/guards/user.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<PublicUser[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, UserGuard)
  @Get(':username')
  findOne(@Param('username') username: string): Promise<PublicUser | null> {
    return this.usersService.findOne({ username });
  }

  @UseGuards(JwtAuthGuard, UserGuard)
  @Patch(':username')
  update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(username, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':username')
  @Roles(Role.ADMIN)
  remove(@Param('username') username: string) {
    return this.usersService.remove({ username });
  }
}
