import { Resolver, UseMiddleware, Query, Arg } from 'type-graphql';
import { isAuth } from '../middleware/isAuth';
import { Department } from '../../entity/Department';

@Resolver()
export class DepartmentsResolver {
  @UseMiddleware(isAuth)
  @Query(() => [Department])
  async departments(): Promise<Department[]> {
    return Department.find();
  }
}

@Resolver()
export class DepartmentResolver {
  @UseMiddleware(isAuth)
  @Query(() => Department, { nullable: true })
  async department(
    @Arg('departmentId') deptId: string
  ): Promise<Department | undefined> {
    return Department.findOne({ id: deptId });
  }
}
