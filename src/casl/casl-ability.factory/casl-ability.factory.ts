import {
  PureAbility,
  InferSubjects,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  MatchConditions,
  createMongoAbility,
} from '@casl/ability';
import { ROLES } from 'src/config';
// import { PrismaAbility, Subjects } from '@casl/prisma';
// import { User, Post } from '@prisma/client';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export class User {
  id: number;
  email: string;
  role: string;
  hash: string;
  name: string;
  mobile_no: string;
  created_at: Date;
  updated_at: Date;
}

export class Post {
  id: number;
  content: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export type Subjects = InferSubjects<typeof User | typeof Post> | 'all';
export type AppAbility = PureAbility<[Action, Subjects]>;

export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    console.log('user is', user);
    if (user.role === 'Admin') {
      can(Action.Manage, 'all');
    }

    // can(Action.Update, Post, { created_by: user.id });
    cannot(Action.Read, Post, { created_by: { $ne: user.id } }).because(
      'You can read your own post only',
    );

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
