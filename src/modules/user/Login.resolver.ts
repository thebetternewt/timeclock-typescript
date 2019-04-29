import { Resolver, Arg, Mutation, Ctx } from 'type-graphql';
import { User } from '../../entity/User';
import { compare } from 'bcryptjs';
import { AuthenticationError } from 'apollo-server-core';
import { MyContext } from 'src/types/MyContext';

@Resolver()
export class LoginResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('netId') netId: string,
    @Arg('password') password: string,
    @Ctx() { req }: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ netId });

    // Check if user exists.
    if (!user) {
      throw new AuthenticationError('Invalid login credentials.');
    }

    // Check if user is active.
    if (!user.active) {
      throw new AuthenticationError(
        'Your account is inactive. Please contact your system administrator'
      );
    }

    // Validate password
    const valid = await compare(password, user.password);

    if (!valid) {
      throw new AuthenticationError('Invalid login credentials.');
    }

    req.session!.userId = user.id;
    req.session!.isAdmin = user.admin;

    return user;
  }
}
