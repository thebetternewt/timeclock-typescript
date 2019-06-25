import DataLoader from 'dataloader';
import { In } from 'typeorm';

import { User } from '../../entity/User';
import { UserDepartment } from '../../entity/UserDepartment';

const batchUsers = async (departmentIds: string[]) => {
	// Inner Join User and Department tables and select were department Id is
	// in list of department Ids.
	const userDepartments = await UserDepartment.find({
		join: {
			alias: 'userDepartment',
			innerJoinAndSelect: {
				user: 'userDepartment.user',
			},
		},
		where: {
			deptId: In(departmentIds),
		},
	});

	// console.log('userDepts:', userDepartments);

	const deptIdToUsers: { [key: string]: User[] } = {};

	/*
  ==> Data looks like this:

  {
    userId: 'fdsa',
    departmentId: 'asdf',
    __user__: { id: 'fdsa', netId: 'tt123', ... }
  }
  */

	// Loop through the results and add them to the map.
	userDepartments.forEach(du => {
		if (du.deptId in deptIdToUsers) {
			deptIdToUsers[du.deptId].push((du as any).__user__);
		} else {
			deptIdToUsers[du.deptId] = [(du as any).__user__];
		}
	});

	// console.log('userDepartments:', userDepartments);

	return departmentIds.map(deptId => deptIdToUsers[deptId]);
};

export const createUsersLoader = () => new DataLoader(batchUsers);
