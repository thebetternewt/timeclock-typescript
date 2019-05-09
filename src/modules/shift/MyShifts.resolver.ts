import {
  Between,
  FindOperator,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { Resolver, Query, UseMiddleware, Arg, Ctx } from 'type-graphql';

import { isAuth } from '../middleware/isAuth';
import { Shift } from '../../entity/Shift';
import { MyContext } from 'src/types/MyContext';

@Resolver()
export class MyShiftsResolver {
  @UseMiddleware(isAuth)
  @Query(() => [Shift])
  async myShifts(
    @Ctx() { req }: MyContext,
    @Arg('deptId', { nullable: true }) deptId?: string,
    @Arg('startDate', { nullable: true }) startDate?: Date,
    @Arg('endDate', { nullable: true }) endDate?: Date
  ): Promise<Shift[]> {
    interface ShiftSearchParams {
      userId: string;
      deptId?: string;
      timeIn?: FindOperator<any> | Date;
    }

    const { userId } = req.session!;

    const searchParams: ShiftSearchParams = { userId };

    if (deptId) {
      searchParams.deptId = deptId;
    }

    if (startDate && endDate) {
      searchParams.timeIn = Between(startDate, endDate);
    } else if (startDate) {
      searchParams.timeIn = MoreThanOrEqual(startDate);
    } else if (endDate) {
      searchParams.timeIn = LessThanOrEqual(endDate);
    }

    return Shift.find(searchParams);
  }
}
