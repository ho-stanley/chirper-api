import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PasswordService } from 'src/utils/password/password.service';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { PublicUser } from 'src/utils/typings/public-user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<PublicUser> {
    await this.validateCreateUserData(createUserDto);
    const { password, ...rest } = createUserDto;
    const hashedPassword = await this.passwordService.hashPassword(password);
    const user = await this.prismaService.user.create({
      data: {
        password: hashedPassword,
        ...rest,
      },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
    return user;
  }

  findAll(): Promise<PublicUser[]> {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
  }

  /**
   * This returns a user with their hashed password, should only be used
   * if you need their password. Use findOne() method in other cases.
   */
  findOneWithAllDetails(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<PublicUser | null> {
    return this.prismaService.user.findUnique({
      where: userWhereUniqueInput,
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
  }

  update(username: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${username} user`;
  }

  async remove(userWhereUniqueInput: Prisma.UserWhereUniqueInput) {
    const user = await this.prismaService.user
      .delete({
        where: userWhereUniqueInput,
      })
      .catch(() => {
        throw new BadRequestException('Username does not exist');
      });
    return user;
  }

  /**
   * Validates password matches and username is not in use.
   * @param createUserDto - User data
   * @throws Will throw an error if password doesn't match or username is in use.
   */
  async validateCreateUserData(createUserDto: CreateUserDto): Promise<void> {
    const { username, password, repeatPassword } = createUserDto;
    if (password !== repeatPassword)
      throw new BadRequestException('Password does not match');
    const user = await this.findOne({
      username,
    });
    if (user) throw new BadRequestException('Username is already in use');
  }
}
