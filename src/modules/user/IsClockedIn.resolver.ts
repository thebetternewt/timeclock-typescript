import { Resolver, Ctx, Query, UseMiddleware } from 'type-graphql';
import { IsNull } from 'typeorm';
import { User } from '../../entity/User';
import { Shift } from '../../entity/Shift';
import { MyContext } from '../../types/MyContext';
import { isAuth } from '../middleware/isAuth';
import { logger } from '../middleware/logger';

@Resolver(User)
export class IsClockedInResolver {
  @Query(() => Boolean)
  @UseMiddleware(isAuth, logger)
  async isClockedIn(@Ctx() { req }: MyContext): Promise<boolean> {
    const { userId } = req.session!;
    const shift = await Shift.findOne({ userId, timeOut: IsNull() });
    return !!shift;
  }
}
