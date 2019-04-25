import { Resolver, Ctx, Query, Authorized } from 'type-graphql';
import { User } from '../../entity/User';
import { MyContext } from 'src/types/MyContext';

@Resolver(User)
export class MeResolver {
  @Query(() => User, { nullable: true, complexity: 5 })
  @Authorized()
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    if (!req.session!.userId) {
      return undefined;
    }
    return User.findOne(req.session!.userId);
  }
}
