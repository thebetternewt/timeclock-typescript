import { InputType, Field } from 'type-graphql';

@InputType()
export class ShiftInput {
  @Field({ nullable: true })
  id?: string;

  @Field()
  timeIn: Date;

  @Field()
  timeOut: Date;

  @Field()
  userId: string;

  @Field()
  deptId: string;
}
