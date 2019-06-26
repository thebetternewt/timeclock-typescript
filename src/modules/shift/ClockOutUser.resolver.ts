import { UserInputError, ForbiddenError } from 'apollo-server-core';
import { Resolver, Mutation, UseMiddleware, ID, Arg, Ctx } from 'type-graphql';
import { IsNull } from 'typeorm';

import { Shift } from '../../entity/Shift';
import { isAuth } from '../middleware/isAuth';
import { MyContext } from '../../types/MyContext';
import { isCurrentUser } from '../utils/isCurrentUser';
import { isSupervisor } from '../utils/isSupervisor';

@Resolver()
export class ClockOutUserResolver {
	@UseMiddleware(isAuth)
	@Mutation(() => Shift)
	async clockOutUser(
		@Ctx() ctx: MyContext,
		@Arg('userId', () => ID) userId: string
	): Promise<Shift> {
		const shift = await Shift.findOne({ userId, timeOut: IsNull() });

		// Throw error if not clocked in.
		if (!shift) {
			throw new UserInputError('User not clocked in.');
		}

		// Throw error if not current user or department supervisor.
		if (
			!isCurrentUser(ctx, await shift.user) &&
			!isSupervisor(ctx, shift.deptId)
		) {
			throw new ForbiddenError('Not authorized.');
		}

		shift.timeOut = new Date();

		await shift.save();

		return shift;
	}
}
