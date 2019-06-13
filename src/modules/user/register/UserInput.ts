import { InputType, Field } from 'type-graphql';
import {
	Length,
	MaxLength,
	Matches,
	IsEmail,
	MinLength,
	IsPhoneNumber,
} from 'class-validator';

@InputType()
export class UserInput {
	@Field()
	@MaxLength(8)
	netId: string;

	@Field()
	// @Length(9, 9, { message: 'Must be exactly 9 digits' })
	@Matches(/^\d{9}$/, { message: 'Student ID must be exactly 9 digits' })
	nineDigitId: string;

	@Field()
	@Length(1, 255, { message: 'First name cannot be blank.' })
	firstName: string;

	@Field()
	@Length(1, 255, { message: 'Last name cannot be blank.' })
	lastName: string;

	@Field()
	@IsEmail()
	email: string;

	@Field({ nullable: true })
	@MinLength(6, { message: 'Password must be at least 6 characters long.' })
	password?: string;

	@Field()
	dsf: boolean;

	@Field()
	admin: boolean;

	@Field({ nullable: true })
	@IsPhoneNumber('US')
	phone?: string;

	@Field({ nullable: true })
	street1?: string;

	@Field({ nullable: true })
	street2?: string;

	@Field({ nullable: true })
	city?: string;

	@Field({ nullable: true })
	state?: string;

	@Field({ nullable: true })
	zip?: string;
}
