import { Resolver, UseMiddleware, Query, Arg, ID } from 'type-graphql';
import { isAdmin } from '../middleware/isAdmin';
import { User } from '../../entity/User';
import { UserDepartment } from '../../entity/UserDepartment';
import { In } from 'typeorm';

@Resolver()
export class UsersResolver {
  @UseMiddleware(isAdmin)
  @Query(() => [User], {
    description: 'Returns a list of users for a given department.',
  })
  async usersByDepartment(
    @Arg('deptId', () => ID) deptId: string
  ): Promise<User[]> {
    const userDepartments = await UserDepartment.find({ deptId });

    const userIds = userDepartments.map(ud => ud.userId);

    const users = await User.find({ id: In(userIds) });

    return users;
  }
}
