import { Resolver, Mutation, UseMiddleware, Arg, ID } from 'type-graphql';
import { PayPeriod } from '../../entity/PayPeriod';
import { isAdmin } from '../middleware/isAdmin';

@Resolver(() => PayPeriod)
export class DeletePayPeriodResolver {
	@UseMiddleware(isAdmin)
	@Mutation(() => Boolean)
	async deletePayPeriod(@Arg('id', () => ID) id: string): Promise<boolean> {
		await PayPeriod.delete({ id });
		return true;
	}
}
