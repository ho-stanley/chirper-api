import { AbilityBuilder, AbilityClass } from '@casl/ability';
import { PrismaAbility, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Comment, Post, Role } from '@prisma/client';
import { Action } from 'src/utils/enums/action.enum';
import { PublicUser } from 'src/utils/typings/public-user';

type AppAbility = PrismaAbility<
  [
    string,
    Subjects<{
      User: PublicUser;
      Post: Post;
      Comment: Comment;
    }>,
  ]
>;
const AppAbility = PrismaAbility as AbilityClass<AppAbility>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: PublicUser) {
    const { can, cannot, build } = new AbilityBuilder(AppAbility);

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
