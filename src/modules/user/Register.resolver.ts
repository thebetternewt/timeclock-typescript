import { Resolver, Mutation, Arg } from 'type-graphql';

import { User } from '../../entity/User';
import { UserInput } from './register/UserInput';

@Resolver()
export class RegisterResolver {
	@Mutation(() => User)
	async register(@Arg('data') userData: UserInput): Promise<User> {
		const user = await User.create(userData).save();

		return user;
	}
}
