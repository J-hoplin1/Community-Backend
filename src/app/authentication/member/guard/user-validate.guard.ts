// Standard Packages
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
// Third-party Packages
import { User } from '@prisma/client';
import { Request } from 'express';

// Custom Packages

export class UserValidateGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user: User = request?.user as User;

    /** If member is not approved state */
    if (user.status !== 'Approved') {
      throw new ForbiddenException('User is not approved state');
    }
    return true;
  }
}
