import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/utils/prisma/prisma.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [PrismaModule, CaslModule],
})
export class PostsModule {}
