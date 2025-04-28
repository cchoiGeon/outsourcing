import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enum/role.enum';

export const ROLE_KEY = 'role';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<Role>(ROLE_KEY, context.getHandler());
    
    if (!requiredRole) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (user.role !== requiredRole) {
      throw new UnauthorizedException(`이 기능은 ${requiredRole}만 사용할 수 있습니다.`);
    }

    return true;
  }
} 