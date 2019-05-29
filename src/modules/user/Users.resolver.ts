import { Resolver, UseMiddleware, Query, Arg, ID } from 'type-graphql';
import { isAdmin } from '../middleware/isAdmin';
import { User } from '../../entity/User';
import { UserDepartment } from '../../entity/UserDepartment';
import { In } from 'typeorm';

@Resolver()
export class UsersByDeptResolver {
	@UseMiddleware(isAdmin)
	@Query(() => [User], {
		description: 'Returns a list of users for a given department.',
	})
	async usersByDepartment(
		@Arg('deptId', () => ID) deptId: string
	): Promise<User[]> {
		const userDepartments = await UserDepartment.find({ deptId });

		// Return empty array if no user-department items found.
		if (!userDepartments.length) return [];

		const userIds = userDepartments.map(ud => ud.userId);

		const users = await User.find({ id: In(userIds) });

		return users;
	}
}

@Resolver()
export class UsersResolver {
	@UseMiddleware(isAdmin)
	@Query(() => [User], {
		description: 'Returns a list of all users.',
	})
	async users(): Promise<User[]> {
		return User.find({});
	}
}

@Resolver()
export class UserResolver {
	@UseMiddleware(isAdmin)
	@Query(() => User, {
		description: 'Returns a single user.',
	})
	async user(@Arg('id', () => ID) id: string): Promise<User | undefined> {
		return User.findOne({ id });
	}
}
