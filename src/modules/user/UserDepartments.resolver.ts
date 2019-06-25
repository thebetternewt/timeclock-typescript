import { MyContext } from './../../types/MyContext';
import { isSupervisor } from './../utils/isSupervisor';
import { Resolver, Mutation, Arg, UseMiddleware, ID, Ctx } from 'type-graphql';
import { UserInputError, ForbiddenError } from 'apollo-server-core';

import { Department } from '../../entity/Department';
import { User } from '../../entity/User';
import { UserDepartment } from '../../entity/UserDepartment';
import { isAuth } from '../middleware/isAuth';

interface UserDepartmentOptions {
	userId: string;
	deptId: string;
	supervisor?: boolean;
}

@Resolver()
export class AddToDepartmentResolver {
	@UseMiddleware(isAuth)
	@Mutation(() => Boolean)
	async addToDepartment(
		@Ctx() ctx: MyContext,
		@Arg('userId', () => ID) userId: string,
		@Arg('deptId', () => ID) deptId: string,
		@Arg('supervisor', { nullable: true }) supervisor: boolean
	): Promise<boolean> {
		if (!isSupervisor(ctx, deptId)) {
			throw new ForbiddenError('Not authorized.');
		}

		// Check if user and department exist.
		const department = await Department.findOne(deptId);
		const user = await User.findOne(userId);

		if (!department || !user) {
			throw new UserInputError('User or department not found.');
		}

		const userDepartmentOptions: UserDepartmentOptions = { userId, deptId };

		const currentUser = await User.findOne(ctx.req.session!.userId);

		if (currentUser && currentUser.admin) {
			if (typeof supervisor !== 'undefined') {
				userDepartmentOptions.supervisor = supervisor;
			}
		}

		await UserDepartment.create(userDepartmentOptions).save();

		return true;
	}
}
@Resolver()
export class RemoveFromDepartmentResolver {
	@UseMiddleware(isAuth)
	@Mutation(() => Boolean)
	async removeFromDepartment(
		@Ctx() ctx: MyContext,
		@Arg('userId', () => ID) userId: string,
		@Arg('deptId', () => ID) deptId: string
	): Promise<boolean> {
		if (!isSupervisor(ctx, deptId)) {
			throw new ForbiddenError('Not authorized.');
		}

		const userDepartment = await UserDepartment.findOne({ userId, deptId });

		if (userDepartment && userDepartment.supervisor) {
			throw new ForbiddenError(
				'Not allowed to remove supervisor from department.'
			);
		}

		await UserDepartment.delete({ userId, deptId });

		return true;
	}
}
