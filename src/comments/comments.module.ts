import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { PrismaModule } from 'src/utils/prisma/prisma.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService],
  imports: [PrismaModule, CaslModule],
})
export class CommentsModule {}
