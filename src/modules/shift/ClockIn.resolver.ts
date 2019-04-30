import { Resolver, Mutation, Ctx, UseMiddleware, Arg } from 'type-graphql';
import { MyContext } from '../../types/MyContext';
import { isAuth } from '../middleware/isAuth';
import { Shift } from '../../entity/Shift';
import { IsNull } from 'typeorm';
import { UserInputError } from 'apollo-server-core';

@Resolver()
export class ClockInResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Shift)
  async clockIn(
    @Arg('deptId') deptId: string,
    @Ctx() { req }: MyContext
  ): Promise<Shift | undefined> {
    const { userId } = req.session!;

    // Check if already clocked in.
    let shift = await Shift.findOne({ userId, timeOut: IsNull() });

    // Throw error if already clocked in.
    if (shift) {
      throw new UserInputError('Already clocked in.');
    }

    shift = await Shift.create({ timeIn: new Date(), userId, deptId }).save();

    console.log(shift);

    return shift;
  }
}
