import { CanActivate, ExecutionContext, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { log } from 'console';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotifGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
    private userService: UserService
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const request = context.switchToHttp().getRequest();

    const user = await this.userService.findOne(request.params.id);
    if (!user) {
      return false;
    }
    
    return roles.some(role => user.role.includes(role));
  }
}

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

