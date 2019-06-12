import { MyContext } from './../../types/MyContext';
import { isSupervisor } from './../utils/isSupervisor';
import { Resolver, Mutation, Arg, UseMiddleware, ID, Ctx } from 'type-graphql';
import { UserInputError, ForbiddenError } from 'apollo-server-core';

import { Department } from '../../entity/Department';
import { User } from '../../entity/User';
import { UserDepartment } from '../../entity/UserDepartment';
import { isAuth } from '../middleware/isAuth';
import { isAdmin } from '../middleware/isAdmin';

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

		await UserDepartment.create({ userId, deptId, supervisor }).save();

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

		await UserDepartment.delete({ userId, deptId });

		return true;
	}
}
