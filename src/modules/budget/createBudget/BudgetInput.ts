import { InputType, Field, ID, Int } from 'type-graphql';

@InputType()
export class BudgetInput {
	@Field(() => ID)
	deptId: string;

	@Field(() => Int)
	fiscalYear: number;

	@Field(() => Int)
	amount: number;
}
