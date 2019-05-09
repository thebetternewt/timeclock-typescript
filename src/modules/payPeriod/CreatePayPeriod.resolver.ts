import { Resolver, Mutation, UseMiddleware, Arg } from 'type-graphql';
import { PayPeriod } from '../../entity/PayPeriod';
import { isAdmin } from '../middleware/isAdmin';
import { PayPeriodInput } from './createPayPeriod/PayPeriodInput';

@Resolver(() => PayPeriod)
export class CreatePayPeriodResolver {
  @UseMiddleware(isAdmin)
  @Mutation(() => PayPeriod)
  async createPayPeriod(@Arg('data') data: PayPeriodInput): Promise<PayPeriod> {
    console.log(data);
    const payPeriod = PayPeriod.create(data).save();
    return payPeriod;
  }
}
