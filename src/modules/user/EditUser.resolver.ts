import { Resolver, Mutation, Arg } from 'type-graphql';

import { User } from '../../entity/User';
import { UserInput } from './register/UserInput';
import { UserInputError } from 'apollo-server-core';

@Resolver()
export class UpdateUserResolver {
  @Mutation(() => User)
  async updateUser(@Arg('data')
  {
    id,
    netId,
    nineDigitId,
    firstName,
    lastName,
    email,
  }: UserInput): Promise<User> {
    const user = await User.findOne(id);

    if (!user) {
      throw new UserInputError('User not found.');
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.netId = netId;
    user.nineDigitId = nineDigitId;
    user.email = email;

    await user.save();

    return user;
  }
}
