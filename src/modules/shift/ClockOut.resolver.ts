import { UserInputError } from 'apollo-server-core';
import { Resolver, Ctx, Mutation, UseMiddleware } from 'type-graphql';
import { IsNull } from 'typeorm';

import { Shift } from '../../entity/Shift';
import { MyContext } from '../../types/MyContext';
import { isAuth } from '../middleware/isAuth';

@Resolver()
export class ClockOutResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Shift)
  async clockOut(@Ctx() { req }: MyContext): Promise<Shift> {
    const { userId } = req.session!;

    const shift = await Shift.findOne({ userId, timeOut: IsNull() });

    // Throw error if not clocked in.
    if (!shift) {
      throw new UserInputError('Not clocked in.');
    }

    shift.timeOut = new Date();

    await shift.save();

    return shift;
  }
}
