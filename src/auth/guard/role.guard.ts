import { User } from '@prisma/client';
import { ROLES_KEY } from 'src/decorators';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getClass(), context.getHandler()],
    );

    const currentUser: User = context.switchToHttp().getRequest().user;
    console.log('currentUser', currentUser);

    const user = await this.prisma.user.findUnique({
      where: { id: currentUser.id },
    });
    const isAuthenticatedRole = requiredRoles.includes(user.role);
    if (!isAuthenticatedRole)
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );

    return true;
  }
}
