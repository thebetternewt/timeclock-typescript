import { Resolver, Mutation, Arg, ID, UseMiddleware } from 'type-graphql';

import { Budget } from '../../entity/Budget';
import { BudgetInput } from './createBudget/BudgetInput';
import { UserInputError } from 'apollo-server-core';
import { isAdmin } from '../middleware/isAdmin';

@Resolver()
export class CreateBudgetResolver {
	@UseMiddleware(isAdmin)
	@Mutation(() => Budget)
	async createBudget(@Arg('data') BudgetData: BudgetInput): Promise<Budget> {
		const budget = await Budget.create(BudgetData).save();

		return budget;
	}
}

@Resolver()
export class UpdateBudgetResolver {
	@UseMiddleware(isAdmin)
	@Mutation(() => Budget)
	async updateBudget(
		@Arg('id', () => ID) id: string,
		@Arg('data') { fiscalYear, amount }: BudgetInput
	): Promise<Budget> {
		let budget = await Budget.findOne(id);

		if (!budget) {
			throw new UserInputError('Budget not found.');
		}

		budget.fiscalYear = fiscalYear;
		budget.amount = amount;
		await budget.save();

		return budget;
	}
}
