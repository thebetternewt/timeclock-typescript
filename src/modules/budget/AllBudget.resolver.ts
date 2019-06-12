import { ForbiddenError } from 'apollo-server-core';
import { MyContext } from './../../types/MyContext';
import { Resolver, UseMiddleware, Query, Arg, Int, Ctx } from 'type-graphql';
import { Budget } from '../../entity/Budget';
import { isAuth } from '../middleware/isAuth';
import { UserDepartment } from '../../entity/UserDepartment';

@Resolver(() => Budget)
export class AllBudgetResolver {
	@UseMiddleware(isAuth)
	@Query(() => [Budget])
	async allBudget(
		@Ctx() { req }: MyContext,
		@Arg('fiscalYear', () => Int, { nullable: true }) fiscalYear?: number,
		@Arg('deptId', { nullable: true }) deptId?: string
	): Promise<Budget[]> {
		const { userId, isAdmin } = req.session!;

		interface BudgetSearchParams {
			fiscalYear?: number;
			deptId?: string;
		}

		const searchParams: BudgetSearchParams = {};

		if (fiscalYear) {
			searchParams.fiscalYear = fiscalYear;
		}

		if (deptId) {
			searchParams.deptId = deptId;
		}

		let budgets = await Budget.find(searchParams);

		// Handle case where user is not admin
		if (!isAdmin) {
			// Fetch supervised departments list
			const supervisedDepts = await UserDepartment.find({
				userId,
				supervisor: true,
			});
			console.log('supervisedDepts:', supervisedDepts);

			// Throw error if user is not supervising any departments
			if (supervisedDepts.length === 0) {
				throw new ForbiddenError('Not authorized!');
			}

			// Map departments to list of ids
			const deptIds = supervisedDepts.map(ud => ud.deptId);

			// Filter budgets based on list of department ids
			budgets = budgets.filter(budget => {
				deptIds.includes(budget.deptId);
			});

			console.log(budgets);
		}

		return budgets;
	}
}
