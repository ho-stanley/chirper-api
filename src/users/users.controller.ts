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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RequestWithUser } from 'src/utils/typings/request-user';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserDto })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({ type: [UserDto] })
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  findOne(@Param('username') username: string): Promise<UserDto | null> {
    return this.usersService.findOne({ username });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':username')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: RequestWithUser,
  ): Promise<UserDto> {
    return this.usersService.update({ username }, updateUserDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':username/role')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  updateRole(
    @Param('username') username: string,
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Req() req: RequestWithUser,
  ): Promise<UserDto> {
    return this.usersService.updateRole(
      { username },
      updateUserRoleDto.role,
      req.user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':username')
  @ApiBearerAuth()
  @ApiOkResponse({ type: UserDto })
  remove(
    @Param('username') username: string,
    @Req() req: RequestWithUser,
  ): Promise<UserDto> {
    return this.usersService.remove({ username }, req.user);
  }
}
