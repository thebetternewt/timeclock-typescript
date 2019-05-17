import { InputType, Field, Int, ID } from 'type-graphql';
import { Matches } from 'class-validator';

@InputType()
export class WorkStudyPeriodInput {
  @Field(() => Int)
  year: number;

  @Field()
  name: string;

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
}
