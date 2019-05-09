import { InputType, Field, ID, Int, registerEnumType } from 'type-graphql';

import { SemesterType } from '../../../entity/PayPeriod';
import { Semester } from '../createPayPeriod/PayPeriodInput';

registerEnumType(Semester, {
  name: 'Semester',
});

@InputType()
export class SearchPayPeriodsInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field({ nullable: true })
  // @IsDate({ message: 'Invalid date.' })
  containsDate?: string;

  @Field(() => Int, { nullable: true })
  fiscalYear?: number;

  @Field(() => Int, { nullable: true })
  year?: number;

  @Field(() => Int, { nullable: true })
  payPeriodId?: number;

  @Field(() => Semester, { nullable: true })
  semester?: SemesterType;
}
