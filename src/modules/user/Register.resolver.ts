import { ForbiddenError } from 'apollo-server-core';
import { MyContext } from './../../types/MyContext';
import { Resolver, Mutation, Arg, UseMiddleware, Ctx } from 'type-graphql';

import { User } from '../../entity/User';
import { UserInput } from './register/UserInput';
import { Dsf } from '../../entity/Dsf';
import { isAuth } from '../middleware/isAuth';
import { UserDepartment } from '../../entity/UserDepartment';

@Resolver()
export class RegisterResolver {
	@UseMiddleware(isAuth)
	@Mutation(() => User)
	async register(
		@Ctx() { req }: MyContext,
		@Arg('data') { dsf, admin, ...userData }: UserInput
	): Promise<User> {
		const { userId, isAdmin } = req.session!;
		if (!isAdmin) {
			const supervisedDepartment = await UserDepartment.findOne({
				userId,
				supervisor: true,
			});
			if (!supervisedDepartment) {
				throw new ForbiddenError('Not authorized.');
			}
		}

		const amAdmin = isAdmin && admin;
		const user = await User.create({ ...userData, admin: amAdmin }).save();

		if (dsf) {
			await Dsf.create({ userId: user.id }).save();
		}

		return user;
	}
}
