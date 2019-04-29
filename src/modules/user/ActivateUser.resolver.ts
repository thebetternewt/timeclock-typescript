import { Resolver, Mutation, UseMiddleware, Arg, Ctx } from 'type-graphql';
import { isAdmin } from '../middleware/isAdmin';
import { User } from '../../entity/User';
import { ForbiddenError } from 'apollo-server-core';
import { isCurrentUser } from '../utils/isCurrentUser';
import { MyContext } from '../../types/MyContext';

@Resolver()
export class ActivateUserResolver {
  @UseMiddleware(isAdmin)
  @Mutation(() => Boolean)
  async activateUser(
    @Arg('netId') netId: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
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
