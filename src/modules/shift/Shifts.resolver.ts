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
} from 'type-graphql';

import { isAdmin } from '../middleware/isAdmin';
import { Shift } from '../../entity/Shift';
import { ShiftInput } from './shifts/ShiftInput';
import { UserInputError } from 'apollo-server-core';

@Resolver()
export class ShiftsResolver {
  @UseMiddleware(isAdmin)
  @Query(() => [Shift])
  async shifts(
    @Arg('userId', () => ID, { nullable: true }) userId?: string,
    @Arg('deptId', () => ID, { nullable: true }) deptId?: string,
    @Arg('startDate', { nullable: true }) startDate?: Date,
    @Arg('endDate', { nullable: true }) endDate?: Date
  ): Promise<Shift[]> {
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
      searchParams.timeIn = Between(startDate, endDate);
    } else if (startDate) {
      searchParams.timeIn = MoreThanOrEqual(startDate);
    } else if (endDate) {
      searchParams.timeIn = LessThanOrEqual(endDate);
    }

    console.log('searchParams:', searchParams);

    return Shift.find({ where: searchParams, order: { timeIn: 'ASC' } });
  }
}

@Resolver()
export class CreateShiftResolver {
  @UseMiddleware(isAdmin)
  @Mutation(() => Shift)
  async createShift(@Arg('data') data: ShiftInput): Promise<Shift> {
    return Shift.create(data).save();
  }
}

@Resolver()
export class UpdateShiftResolver {
  @UseMiddleware(isAdmin)
  @Mutation(() => Shift)
  async updateShift(
    @Arg('id', () => ID) id: string,
    @Arg('data')
    { timeIn, timeOut, userId, deptId }: ShiftInput
  ): Promise<Shift> {
    const shift = await Shift.findOne(id);

    if (!shift) {
      throw new UserInputError('Shift not found.');
    }

    shift.timeIn = timeIn;
    shift.timeOut = timeOut;
    shift.userId = userId;
    shift.deptId = deptId;

    return shift.save();
  }
}

@Resolver()
export class DeleteShiftResolver {
  @UseMiddleware(isAdmin)
  @Mutation(() => Boolean)
  async deleteShift(@Arg('id', () => ID) id: string): Promise<boolean> {
    const shift = await Shift.findOne(id);

    if (!shift) {
      return false;
    }

    await shift.remove();

    return true;
  }
}
