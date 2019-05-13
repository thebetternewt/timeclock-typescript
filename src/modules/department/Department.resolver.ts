import { Resolver, UseMiddleware, Query, Arg, ID } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { Department } from '../../entity/Department';

@Resolver(() => Department)
export class DepartmentsResolver {
  @UseMiddleware(isAuth)
  @Query(() => [Department])
  async departments(): Promise<Department[]> {
    return Department.find();
  }
}

@Resolver(() => Department)
export class DepartmentResolver {
  @UseMiddleware(isAuth)
  @Query(() => Department, { nullable: true })
  async department(
    @Arg('id', () => ID) deptId: string
  ): Promise<Department | undefined> {
    return Department.findOne({ id: deptId });
  }
}
