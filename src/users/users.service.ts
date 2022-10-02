import { subject } from '@casl/ability';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/utils/enums/action.enum';
import { prismaQueryError } from 'src/utils/error-handler';
import { PasswordService } from 'src/utils/password/password.service';
import { PrismaService } from 'src/utils/prisma/prisma.service';
import { PublicUser } from 'src/utils/typings/public-user';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateWithRoleDto } from './dto/create-with-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<PublicUser> {
    await this.validateCreateUserData(createUserDto);
    const { username, password } = createUserDto;
    const hashedPassword = await this.passwordService.hashPassword(password);
    const createdUser = await this.prismaService.user.create({
      data: {
        password: hashedPassword,
        username,
      },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return createdUser;
  }

  async createWithRole(
    createWithRoleDto: CreateWithRoleDto,
    user: PublicUser,
  ): Promise<PublicUser> {
    const userRequesting = await this.prismaService.user
      .findUniqueOrThrow({
        where: { username: user.username },
      })
      .catch(prismaQueryError);
    const ability = this.caslAbilityFactory.createForUser(userRequesting);

    if (ability.cannot(Action.Create, 'User')) throw new ForbiddenException();

    await this.validateCreateUserData(createWithRoleDto);
    const { username, password, role } = createWithRoleDto;
    const hashedPassword = await this.passwordService.hashPassword(password);
    const createdUser = await this.prismaService.user.create({
      data: {
        password: hashedPassword,
        username,
        role,
      },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return createdUser;
  }

  async findAll(): Promise<PublicUser[]> {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return users;
  }

  /**
   * This returns a user with their hashed password, should only be used
   * if you need their password. Use findOne() method in other cases.
   */
  async findOneWithAllDetails(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    const user = await this.prismaService.user
      .findUnique({
        where: userWhereUniqueInput,
      })
      .catch(prismaQueryError);

    return user;
  }

  async findOne(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<PublicUser | null> {
    const user = await this.prismaService.user
      .findUnique({
        where: userWhereUniqueInput,
        select: {
          id: true,
          username: true,
          role: true,
        },
      })
      .catch(prismaQueryError);

    return user;
  }

  async update(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    updateUserDto: UpdateUserDto,
    user: PublicUser,
  ): Promise<PublicUser> {
    const userToUpdate = await this.prismaService.user
      .findUniqueOrThrow({
        where: userWhereUniqueInput,
      })
      .catch(prismaQueryError);
    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.cannot(Action.Update, subject('User', userToUpdate)))
      throw new ForbiddenException();

    const { password, repeatPassword } = updateUserDto;
    if (!this.validatePassword(password, repeatPassword))
      throw new BadRequestException('Password does not match');

    const hashedPassword = await this.passwordService.hashPassword(password);
    const updatedUser = await this.prismaService.user
      .update({
        where: userWhereUniqueInput,
        data: {
          password: hashedPassword,
        },
        select: {
          id: true,
          username: true,
          role: true,
        },
      })
      .catch(prismaQueryError);

    return updatedUser;
  }

  async updateRole(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    role: Role,
    user: PublicUser,
  ): Promise<PublicUser> {
    const userToUpdate = await this.prismaService.user
      .findUniqueOrThrow({
        where: userWhereUniqueInput,
      })
      .catch(prismaQueryError);
    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.cannot(Action.Update, subject('User', userToUpdate)))
      throw new ForbiddenException();

    const updatedUser = await this.prismaService.user
      .update({
        where: userWhereUniqueInput,
        data: { role },
        select: {
          id: true,
          username: true,
          role: true,
        },
      })
      .catch(prismaQueryError);

    return updatedUser;
  }

  async remove(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
    user: PublicUser,
  ): Promise<PublicUser> {
    const userToRemove = await this.prismaService.user
      .findUniqueOrThrow({
        where: userWhereUniqueInput,
      })
      .catch(prismaQueryError);
    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.cannot(Action.Delete, subject('User', userToRemove)))
      throw new ForbiddenException();

    const removedUser = await this.prismaService.user
      .delete({
        where: userWhereUniqueInput,
        select: {
          id: true,
          username: true,
          role: true,
        },
      })
      .catch(prismaQueryError);

    return removedUser;
  }

  /**
   * Check if password match.
   * @param password
   * @param repeatPassword
   */
  validatePassword(password: string, repeatPassword: string): boolean {
    return password === repeatPassword;
  }

  /**
   * Validates password matches and username is not in use.
   * @param createUserDto - User data
   * @throws Will throw an error if password doesn't match or username is in use.
   */
  async validateCreateUserData(createUserDto: CreateUserDto): Promise<void> {
    const { username, password, repeatPassword } = createUserDto;

    if (!this.validatePassword(password, repeatPassword))
      throw new BadRequestException('Password does not match');

    const user = await this.findOne({
      username,
    });

    if (user) throw new BadRequestException('Username is already in use');
  }
}
