import { Resolver, Mutation, UseMiddleware, Arg, Ctx } from 'type-graphql';
import { isAdmin } from '../middleware/isAdmin';
import { User } from '../../entity/User';
import { MyContext } from '../../types/MyContext';
import { AuthenticationError } from 'apollo-server-core';
import { isCurrentUser } from '../utils/isCurrentUser';

@Resolver()
export class RemoveAdminResolver {
  @UseMiddleware(isAdmin)
  @Mutation(() => Boolean)
  async removeAdmin(
    @Arg('netId') netId: string,
    @Ctx() ctx: MyContext
  ): Promise<boolean> {
    const user = await User.findOne({ netId });

    // Return false if user not found.
    if (!user) {
      return false;
    }

    // Throw error if user is logged in user. Logged in users cannot edit
    // their own admin status.
    if (isCurrentUser(ctx, user)) {
      throw new AuthenticationError('Not authorized!');
    }

    user.admin = false;

    await user.save();

    return true;
  }
}
