import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { RequestWithUser } from '../typings/request-user';

/**
 * User guard is used to protect route handlers and allowing
 * only the same user or an admin to access it.
 * Useful if you only want the user to access resources they own.
 *
 * Note: This uses 'username' url parameter to determine if
 * the user should be allowed to access the resource.
 *
 * JwtAuthGuard must be used before UserGuard.
 */
@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const { user } = req;
    if (user.role.toLowerCase() === Role.ADMIN.toLowerCase()) return true;
    const { username } = req.params;
    if (!username) return false;
    return username.toLowerCase() === user.username.toLowerCase();
  }
}
