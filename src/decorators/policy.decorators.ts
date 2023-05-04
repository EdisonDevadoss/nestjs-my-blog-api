import { SetMetadata } from '@nestjs/common';
import { AppAbility, Action, Subjects } from 'src/casl/casl-ability.factory';

// interface IPolicyHandler {
//   handle(ability: AppAbility): boolean;
// }

// type PolicyHandlerCallback = (ability: AppAbility) => boolean;

// export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

// export const CHECK_POLICIES_KEY = 'check_policy';
// export const CheckPolicies = (...handlers: PolicyHandler[]) =>
//   SetMetadata(CHECK_POLICIES_KEY, handlers);

export interface RequiredRole {
  action: Action;
  subject: Subjects;
}
export const CHECK_ABILITY = 'check_ability';
export const CheckAbilities = (...requirements: RequiredRole[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
