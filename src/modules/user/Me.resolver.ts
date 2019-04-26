import { Resolver, Ctx, Query, UseMiddleware } from 'type-graphql';
import { User } from '../../entity/User';
import { MyContext } from 'src/types/MyContext';
import { isAuth } from '../middleware/isAuth';
import { logger } from '../middleware/logger';

@Resolver(User)
export class MeResolver {
  @Query(() => User, { nullable: true, complexity: 5 })
  @UseMiddleware(isAuth, logger)
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    if (!req.session!.userId) {
      return undefined;
    }
    return User.findOne(req.session!.userId);
  }
}
