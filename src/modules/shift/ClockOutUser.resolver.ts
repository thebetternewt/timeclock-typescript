import { UserInputError } from 'apollo-server-core';
import { Resolver, Mutation, UseMiddleware, ID, Arg } from 'type-graphql';
import { IsNull } from 'typeorm';

import { Shift } from '../../entity/Shift';
import { isAdmin } from '../middleware/isAdmin';

@Resolver()
export class ClockOutUserResolver {
  @UseMiddleware(isAdmin)
  @Mutation(() => Shift)
  async clockOutUser(@Arg('userId', () => ID) userId: string): Promise<Shift> {
    const shift = await Shift.findOne({ userId, timeOut: IsNull() });

    // Throw error if not clocked in.
    if (!shift) {
      throw new UserInputError('User not clocked in.');
    }

    shift.timeOut = new Date();

    await shift.save();

    return shift;
  }
}
