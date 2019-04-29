import { Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql';
import { UserInputError } from 'apollo-server-core';

import { Department } from '../../entity/Department';
import { User } from '../../entity/User';
import { UserDepartment } from '../../entity/UserDepartment';
import { isAuth } from '../middleware/isAuth';
import { isAdmin } from '../middleware/isAdmin';

@Resolver()
export class AddToDepartmentResolver {
  @UseMiddleware(isAuth, isAdmin)
  @Mutation(() => Boolean)
  async addToDepartment(
    @Arg('userId') userId: string,
    @Arg('deptId') deptId: string,
    @Arg('supervisor', { nullable: true }) supervisor: boolean
  ): Promise<boolean> {
    // Check if user and department exist.
    const department = await Department.findOne(deptId);
    const user = await User.findOne(userId);

    if (!department || !user) {
      throw new UserInputError('User or department not found.');
    }

    await UserDepartment.create({ userId, deptId, supervisor }).save();

    return true;
  }
}
@Resolver()
export class RemoveFromDepartmentResolver {
  @UseMiddleware(isAuth, isAdmin)
  @Mutation(() => Boolean)
  async removeFromDepartment(
    @Arg('userId') userId: string,
    @Arg('deptId') deptId: string
  ): Promise<boolean> {
    await UserDepartment.delete({ userId, deptId });

    return true;
  }
}
