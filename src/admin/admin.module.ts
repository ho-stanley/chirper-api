import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AdminController } from './admin.controller';

@Module({
  controllers: [AdminController],
  imports: [UsersModule],
})
export class AdminModule {}
