import { Resolver, Mutation, UseMiddleware, Arg, Ctx } from 'type-graphql';
import { isAdmin } from '../middleware/isAdmin';
import { User } from '../../entity/User';
import { ForbiddenError } from 'apollo-server-core';
import { isCurrentUser } from '../utils/isCurrentUser';
import { MyContext } from '../../types/MyContext';

@Resolver()
export class DeactivateUserResolver {
  @UseMiddleware(isAdmin)
  @Mutation(() => Boolean)
  async deactivateUser(
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

    user.active = false;

    await user.save();

    // ! TODO: Kill user session if logged in.

    return true;
  }
}
