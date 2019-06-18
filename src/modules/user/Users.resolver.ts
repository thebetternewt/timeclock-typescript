import { MyContext } from './../../types/MyContext';
import { ForbiddenError } from 'apollo-server-core';
import { Resolver, UseMiddleware, Query, Arg, ID, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import { UserDepartment } from '../../entity/UserDepartment';
import { In } from 'typeorm';
import { isSupervisor } from '../utils/isSupervisor';
import { isAuth } from '../middleware/isAuth';

@Resolver()
export class UsersByDeptResolver {
	@UseMiddleware(isAuth)
	@Query(() => [User], {
		description: 'Returns a list of users for a given department.',
	})
	async usersByDepartment(
		@Ctx() ctx: MyContext,
		@Arg('deptId', () => ID) deptId: string
	): Promise<User[]> {
		if (!isSupervisor(ctx)) {
			throw new ForbiddenError('Not authorized.');
		}

		const userDepartments = await UserDepartment.find({ deptId });

		// Return empty array if no user-department items found.
		if (!userDepartments.length) return [];

		const userIds = userDepartments.map(ud => ud.userId);

		const users = await User.find({
			where: { id: In(userIds) },
			order: { lastName: 'DESC' },
		});

		return users;
	}
}

@Resolver()
export class UsersResolver {
	@UseMiddleware(isAuth)
	@Query(() => [User], {
		description: 'Returns a list of all users.',
	})
	async users(@Ctx() ctx: MyContext): Promise<User[]> {
		if (!isSupervisor(ctx)) {
			throw new ForbiddenError('Not authorized.');
		}

		return User.find({ order: { lastName: 'DESC' } });
	}
}

@Resolver()
export class UserResolver {
	@UseMiddleware(isAuth)
	@Query(() => User, {
		description: 'Returns a single user.',
	})
	async user(
		@Ctx() ctx: MyContext,
		@Arg('id', () => ID) id: string
	): Promise<User | undefined> {
		if (!isSupervisor(ctx)) {
			throw new ForbiddenError('Not authorized.');
		}

		return User.findOne({ id });
	}
}
