import { Resolver, UseMiddleware, Query, Arg } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { PayPeriod, SemesterType } from '../../entity/PayPeriod';
import { SearchPayPeriodsInput } from './searchPayPeriods/SearchPayPeriodsInput';
import { MoreThanOrEqual, FindOperator, LessThanOrEqual } from 'typeorm';

@Resolver()
export class PayPeriodsResolver {
  @UseMiddleware(isAuth)
  @Query(() => [PayPeriod])
  async payPeriods(
    @Arg('data') data: SearchPayPeriodsInput
  ): Promise<PayPeriod[]> {
    interface PayPeriodSearchParams {
      id?: string;
      startDate?: FindOperator<string>;
      endDate?: FindOperator<string>;
      fiscalYear?: number;
      year?: number;
      payPeriodId?: number;
      semester?: SemesterType;
    }

    const searchParams: PayPeriodSearchParams = {};

    if (data.id) {
      searchParams.id = data.id;
    }

    if (data.containsDate) {
      searchParams.startDate = LessThanOrEqual(data.containsDate);
      searchParams.endDate = MoreThanOrEqual(data.containsDate);
    }

    if (data.fiscalYear) {
      searchParams.fiscalYear = data.fiscalYear;
    }

    if (data.year) {
      searchParams.year = data.year;
    }

    if (data.payPeriodId) {
      searchParams.payPeriodId = data.payPeriodId;
    }

    if (data.semester) {
      searchParams.semester = data.semester;
    }

    const payPeriods = await PayPeriod.find(searchParams);
    return payPeriods;
  }
}

@Resolver()
export class PayPeriodResolver {
  @UseMiddleware(isAuth)
  @Query(() => PayPeriod, { nullable: true })
  async payPeriod(
    @Arg('payPeriodId') deptId: string
  ): Promise<PayPeriod | undefined> {
    // TODO: Search by date
    return PayPeriod.findOne({ id: deptId });
  }
}
