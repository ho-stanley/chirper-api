import { AbilityBuilder, PureAbility } from '@casl/ability';
import { PrismaQuery, Subjects, createPrismaAbility } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Comment, Post, Role, User } from '@prisma/client';
import { Action } from 'src/utils/enums/action.enum';
import { PublicUser } from 'src/utils/typings/public-user';

type AppSubjects =
  | 'all'
  | Subjects<{
      User: User;
      Post: Post;
      Comment: Comment;
    }>;

type AppAbility = PureAbility<[Action, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: PublicUser) {
    const { can, build } = new AbilityBuilder<AppAbility>(createPrismaAbility);

    if (user.role === Role.ADMIN) {
      // Admins can access all resources
      can(Action.Manage, 'all');
    } else {
      can(Action.Read, 'all');
    }

    // Users can only update or delete their own resources
    can([Action.Update, Action.Delete], ['Post', 'Comment'], {
      authorId: user.id,
    });

    return build();
  }
}
