import { InputType, Field } from 'type-graphql'
import { Length, MaxLength, Matches, IsEmail } from 'class-validator'
import { PasswordMixin } from '../../shared/PasswordInput'

@InputType()
export class RegisterInput extends PasswordMixin(class {}) {
  @Field()
  @MaxLength(8)
  netId: string

  @Field()
  // @Length(9, 9, { message: 'Must be exactly 9 digits' })
  @Matches(/^\d{9}$/, { message: 'Must be exactly 9 digits' })
  nineDigitId: string

  @Field()
  @Length(1, 255)
  firstName: string

  @Field()
  @Length(1, 255)
  lastName: string

  @Field()
  @IsEmail()
  email: string
}
