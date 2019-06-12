import { ForbiddenError } from 'apollo-server-core';
import { MyContext } from './../../types/MyContext';
import { Resolver, UseMiddleware, Query, Arg, Int, Ctx } from 'type-graphql';
import { Budget } from '../../entity/Budget';
import { isAuth } from '../middleware/isAuth';
import { isSupervisor } from '../utils/isSupervisor';

@Resolver(() => Budget)
export class BudgetResolver {
	@UseMiddleware(isAuth)
	@Query(() => Budget)
	async budget(
		@Ctx() ctx: MyContext,
		@Arg('fiscalYear', () => Int) fiscalYear: number,
		@Arg('deptId') deptId: string
	): Promise<Budget | undefined> {
		if (!isSupervisor(ctx, deptId)) {
			throw new ForbiddenError('Not authorized!');
		}
		return Budget.findOne({ deptId, fiscalYear });
	}
}
