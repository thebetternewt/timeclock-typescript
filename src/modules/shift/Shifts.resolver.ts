import { MyContext } from './../../types/MyContext';
import {
  Between,
  FindOperator,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import {
  Resolver,
  Query,
  UseMiddleware,
  Arg,
  Mutation,
  ID,
  Ctx,
} from 'type-graphql';

import { isAuth } from '../middleware/isAuth';
import { Shift } from '../../entity/Shift';
import { ShiftInput } from './shifts/ShiftInput';
import { UserInputError, ForbiddenError } from 'apollo-server-core';
import { isSupervisor } from '../utils/isSupervisor';
import { isCurrentUser } from '../utils/isCurrentUser';
import { User } from '../../entity/User';
import { startOfMinute } from 'date-fns';

@Resolver()
export class ShiftsResolver {
  @UseMiddleware(isAuth)
  @Query(() => [Shift])
  async shifts(
    @Ctx() ctx: MyContext,
    @Arg('userId', () => ID, { nullable: true }) userId?: string,
    @Arg('deptId', () => ID, { nullable: true }) deptId?: string,
    @Arg('startDate', { nullable: true }) startDate?: Date,
    @Arg('endDate', { nullable: true }) endDate?: Date
  ): Promise<Shift[]> {
    const { isAdmin, userId: currentUserId } = ctx.req.session!;

    if (!isAdmin && userId !== currentUserId && !isSupervisor(ctx, deptId)) {
      throw new ForbiddenError('Not authorized...');
    }

    interface ShiftSearchParams {
      userId?: string;
      deptId?: string;
      timeIn?: FindOperator<any> | Date;
    }

    const searchParams: ShiftSearchParams = {};

    if (userId) {
      searchParams.userId = userId;
    }

    if (deptId) {
      searchParams.deptId = deptId;
    }

    if (startDate && endDate) {
      console.log('start:', startDate, 'end:', endDate);
      searchParams.timeIn = Between(startDate, endDate);
    } else if (startDate) {
      searchParams.timeIn = MoreThanOrEqual(startDate);
    } else if (endDate) {
      searchParams.timeIn = LessThanOrEqual(endDate);
    }

    return Shift.find({ where: searchParams, order: { timeIn: 'ASC' } });
  }
}

@Resolver()
export class CreateShiftResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Shift)
  async createShift(
    @Ctx() ctx: MyContext,
    @Arg('data') { timeIn, timeOut, ...data }: ShiftInput
  ): Promise<Shift> {
    // Throw error if current user not admin or supervisor of shift department.
    if (!isSupervisor(ctx, data.deptId)) {
      throw new ForbiddenError('Not authorized!');
    }

    timeIn = startOfMinute(timeIn);
    timeOut = startOfMinute(timeOut);

    console.log('in:', timeIn);
    console.log('out:', timeOut);

    return Shift.create({ timeIn, timeOut, ...data }).save();
  }
}

@Resolver()
export class UpdateShiftResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Shift)
  async updateShift(
    @Ctx() ctx: MyContext,
    @Arg('id', () => ID) id: string,
    @Arg('data')
    { timeIn, timeOut, userId, deptId }: ShiftInput
  ): Promise<Shift> {
    const user = await User.findOne(userId);

    if (!isCurrentUser(ctx, user!) && !isSupervisor(ctx, deptId)) {
      throw new ForbiddenError('Not authorized!');
    }

    const shift = await Shift.findOne(id);

    if (!shift) {
      throw new UserInputError('Shift not found.');
    }

    shift.timeIn = startOfMinute(timeIn);
    shift.timeOut = startOfMinute(timeOut);
    shift.userId = userId;
    shift.deptId = deptId;

    return shift.save();
  }
}

@Resolver()
export class DeleteShiftResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deleteShift(
    @Ctx() ctx: MyContext,
    @Arg('id', () => ID) id: string
  ): Promise<boolean> {
    const shift = await Shift.findOne(id);

    if (!shift) {
      return false;
    }

    // Only allow delete if current user is admin or supervisor of
    // department associated with shift.
    if (!isSupervisor(ctx, shift.deptId)) {
      throw new ForbiddenError('Not authorized!');
    }

    await shift.remove();

    return true;
  }
}
