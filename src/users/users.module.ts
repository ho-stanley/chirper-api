import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/utils/prisma/prisma.module';
import { PasswordModule } from 'src/utils/password/password.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaModule, PasswordModule, CaslModule],
})
export class UsersModule {}
