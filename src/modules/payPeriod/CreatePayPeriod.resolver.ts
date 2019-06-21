import { Resolver, Mutation, UseMiddleware, Arg } from 'type-graphql';
import { PayPeriod } from '../../entity/PayPeriod';
import { isAdmin } from '../middleware/isAdmin';
import { PayPeriodInput } from './createPayPeriod/PayPeriodInput';
import { UserInputError } from 'apollo-server-core';

@Resolver(() => PayPeriod)
export class CreatePayPeriodResolver {
	@UseMiddleware(isAdmin)
	@Mutation(() => PayPeriod)
	async createPayPeriod(@Arg('data') data: PayPeriodInput): Promise<PayPeriod> {
		const payPeriod = await PayPeriod.findOne({
			year: data.year,
			payPeriodId: data.payPeriodId,
		});

		if (payPeriod) {
			throw new UserInputError(
				`Pay period ${data.year} #${data.payPeriodId} already exists.`
			);
		}

		return PayPeriod.create(data).save();
	}
}
