import { Resolver, Ctx, Query, UseMiddleware } from 'type-graphql';
import { User } from '../../entity/User';
import { MyContext } from '../../types/MyContext';
import { isAuth } from '../middleware/isAuth';

@Resolver(User)
export class MeResolver {
	@Query(() => User, { nullable: true, complexity: 5 })
	@UseMiddleware(isAuth)
	async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
		if (!req.session!.userId) {
			return new Promise(() => undefined);
		}

		return User.findOne(req.session!.userId);
	}
}
