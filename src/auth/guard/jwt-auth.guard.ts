import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('login') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    if (err || !user) throw new UnauthorizedException('Invalid access token');
    const token = this.getHeaderFromRequest(context);
    const response = context.switchToHttp().getResponse();
    response.header('Authorization', `Bearer ${token}`);
    return user;
  }

  getHeaderFromRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request['headers']['authorization'].split(' ')[1];
    return token;
  }
}
