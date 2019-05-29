import { InputType, Field } from 'type-graphql';
import {
	Length,
	MaxLength,
	Matches,
	IsEmail,
	MinLength,
} from 'class-validator';

@InputType()
export class UserInput {
	@Field()
	id: string;

	@Field()
	@MaxLength(8)
	netId: string;

	@Field()
	// @Length(9, 9, { message: 'Must be exactly 9 digits' })
	@Matches(/^\d{9}$/, { message: '(Student ID must be exactly 9 digits' })
	nineDigitId: string;

	@Field()
	@Length(1, 255)
	firstName: string;

	@Field()
	@Length(1, 255)
	lastName: string;

	@Field()
	@IsEmail()
	email: string;

	@Field()
	@MinLength(6, { message: 'Password must be at least 6 characters long.' })
	password?: string;
}
