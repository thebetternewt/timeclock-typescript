import { InterfaceType, Field, Int, ObjectType } from 'type-graphql';

@InterfaceType()
abstract class IBudgetSummary {
	@Field(() => Int, {
		description:
			'Total expenditures including wages, night shift, and work study in cents.',
	})
	totalExpenditures: number;

	@Field(() => Int, {
		description: 'Total wage (excluding night shift) expenditures in cents.',
	})
	totalWageExpenditures: number;

	@Field(() => Int, {
		description: 'Total night shift expenditures (1.00/hr rate) in cents.',
	})
	totalNightShiftExpenditures: number;

	@Field(() => Int, {
		description: 'Total work study expenditures (30% of wage rate) in cents.',
	})
	totalWorkStudyExpenditures: number;
}

@ObjectType({ implements: IBudgetSummary })
export class BudgetSummary implements IBudgetSummary {
	totalExpenditures: number;
	totalWageExpenditures: number;
	totalNightShiftExpenditures: number;
	totalWorkStudyExpenditures: number;
}
