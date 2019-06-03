import { Resolver, Mutation, Arg, ID, UseMiddleware } from 'type-graphql';
import { UserInputError } from 'apollo-server-core';

import { User } from '../../entity/User';
import { UserInput } from './register/UserInput';
import { isAdmin } from '../middleware/isAdmin';

@Resolver()
export class UpdateUserResolver {
	@UseMiddleware(isAdmin)
	@Mutation(() => User)
	async updateUser(
		@Arg('id', () => ID) id: string,
		@Arg('data')
		{ netId, nineDigitId, firstName, lastName, email, password }: UserInput
	): Promise<User> {
		const user = await User.findOne(id);

		if (!user) {
			throw new UserInputError('User not found.');
		}

		user.firstName = firstName;
		user.lastName = lastName;
		user.netId = netId;
		user.nineDigitId = nineDigitId;
		user.email = email;

		if (password) {
			user.password = password;
		}

		await user.save();

		return user;
	}
}
