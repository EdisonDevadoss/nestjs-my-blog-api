import { ForbiddenError } from '@casl/ability';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { CHECK_ABILITY, RequiredRole } from 'src/decorators/policy.decorators';

@Injectable()
export class AbilityGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<RequiredRole[]>(CHECK_ABILITY, context.getHandler()) ||
      [];
    console.log('rules is', rules);
    const { user } = context.switchToHttp().getRequest();
    console.log('user is', user);
    const ability = this.caslAbilityFactory.createForUser(user);

    try {
      rules.forEach((rule) => {
        return ForbiddenError.from(ability).throwUnlessCan(
          rule.action,
          rule.subject,
        );
      });
      return true;
    } catch (error) {
      console.log('errr', error);
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }
    }
  }
}
