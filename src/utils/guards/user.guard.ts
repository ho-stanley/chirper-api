import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
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
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const { username } = req.params;
    if (!username) return false;
    const { user } = req;
    return username.toLowerCase() === user.username.toLowerCase();
  }
}
