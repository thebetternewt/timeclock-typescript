import { InputType, Field, ID, Int, registerEnumType } from 'type-graphql';
import { SemesterType } from 'src/entity/PayPeriod';

export enum Semester {
  SPRING = 'spring',
  SUMMER = 'summer',
  FALL = 'fall',
}

registerEnumType(Semester, {
  name: 'Semester',
});

@InputType()
export class PayPeriodInput {
  @Field(() => ID, { nullable: true })
  id?: string;

  @Field()
  startDate: string;

  @Field()
  endDate: string;

  @Field(() => Int)
  fiscalYear: number;

  @Field(() => Int)
  year: number;

  @Field(() => Int)
  payPeriodId: number;

  @Field(() => Semester)
  semester: SemesterType;
}
