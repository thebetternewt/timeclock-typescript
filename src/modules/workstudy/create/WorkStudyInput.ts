import { InputType, Field, Int, ID } from 'type-graphql';
import { Matches, Min } from 'class-validator';

@InputType()
export class WorkStudyInput {
  @Field(() => ID)
  userId: string;

  @Field(() => ID)
  deptId: string;

  @Field(() => ID)
  workStudyPeriodId: string;

  @Field()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Start Date must match format YYYY-MM-DD.',
  })
  startDate: string;

  @Field()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'End Date must match format YYYY-MM-DD.',
  })
  endDate: string;

  @Field(() => Int)
  @Min(0, { message: 'Amount cannot be negative.' })
  amount: number;
}
