import { InputType, Field, ClassType } from 'type-graphql';
import { MinLength } from 'class-validator';

export const PasswordMixin = <T extends ClassType>(BaseClass: T) => {
	@InputType({ isAbstract: true })
	class PasswordInput extends BaseClass {
		@Field()
		@MinLength(6, { message: 'Password must be at least 6 characters long.' })
		password: string;
	}

	return PasswordInput;
};
