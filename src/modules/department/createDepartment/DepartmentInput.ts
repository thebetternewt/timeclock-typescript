import { InputType, Field } from 'type-graphql';
import { Length } from 'class-validator';

@InputType()
export class DepartmentInput {
  @Field()
  @Length(1, 100)
  name: string;
}
