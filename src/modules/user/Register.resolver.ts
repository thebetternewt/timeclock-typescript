import { Resolver, Mutation, Arg } from 'type-graphql';

import { User } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';

@Resolver()
export class RegisterResolver {
  @Mutation(() => User)
  async register(@Arg('data') userData: RegisterInput): Promise<User> {
    const user = await User.create(userData).save();

    return user;
  }
}
