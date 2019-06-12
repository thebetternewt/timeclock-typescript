import { Resolver, Mutation, Arg, ID, UseMiddleware } from 'type-graphql';

import { Department } from '../../entity/Department';
import { DepartmentInput } from './createDepartment/DepartmentInput';
import { UserInputError } from 'apollo-server-core';
import { isAdmin } from '../middleware/isAdmin';

@Resolver()
export class CreateDepartmentResolver {
	@UseMiddleware(isAdmin)
	@Mutation(() => Department)
	async createDepartment(
		@Arg('data') departmentData: DepartmentInput
	): Promise<Department> {
		const department = await Department.create(departmentData).save();

		return department;
	}
}

@Resolver()
export class UpdateDepartmentResolver {
	@UseMiddleware(isAdmin)
	@Mutation(() => Department)
	async updateDepartment(
		@Arg('deptId', () => ID) deptId: string,
		@Arg('data') { name }: DepartmentInput
	): Promise<Department> {
		let department = await Department.findOne(deptId);

		if (!department) {
			throw new UserInputError('Department not found.');
		}

		department.name = name;
		await department.save();

		return department;
	}
}
