import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RequestWithUser } from '../typings/request-user';

/**
 * Roles guard is used to protect route handlers and allowing
 * only the specified roles to access it.
 *
 * JwtAuthGuard must be used before RolesGuard.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiresRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiresRoles) return true;
    const { user } = context.switchToHttp().getRequest<RequestWithUser>();
    return requiresRoles.some((role) => user.role.includes(role));
  }
}
