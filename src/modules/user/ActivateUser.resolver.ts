import { Resolver, Mutation, UseMiddleware, Arg, Ctx } from 'type-graphql';

import { isSupervisor } from './../utils/isSupervisor';
import { User } from '../../entity/User';
import { ForbiddenError } from 'apollo-server-core';
import { isCurrentUser } from '../utils/isCurrentUser';
import { MyContext } from '../../types/MyContext';
import { isAuth } from '../middleware/isAuth';

@Resolver()
export class ActivateUserResolver {
	@UseMiddleware(isAuth)
	@Mutation(() => Boolean)
	async activateUser(
		@Arg('netId') netId: string,
		@Ctx() ctx: MyContext
	): Promise<boolean> {
		if (!isSupervisor(ctx)) {
			throw new ForbiddenError('Not authorized.');
		}
		const user = await User.findOne({ netId });

		// Return false if user not found.
		if (!user) {
			return false;
		}

		// Throw error if user is logged in user. Logged in users cannot edit
		// their own active status.
		if (isCurrentUser(ctx, user)) {
			throw new ForbiddenError('Not authorized!');
		}

		user.active = true;

		await user.save();

		return true;
	}
}
