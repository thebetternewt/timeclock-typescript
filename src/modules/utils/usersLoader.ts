import DataLoader from 'dataloader';
import { In } from 'typeorm';

import { User } from '../../entity/User';
import { UserDepartment } from '../../entity/UserDepartment';

const batchUsers = async (departmentIds: string[]) => {
  const userDepartments = await UserDepartment.find({
    join: {
      alias: 'userDepartment',
      innerJoinAndSelect: {
        user: 'userDepartment.user',
      },
    },
    where: {
      departmentId: In(departmentIds),
    },
  });

  console.log('userDepartments:', userDepartments);

  const departmentIdToUsers: { [key: string]: User[] } = {};

  /*
  {
    userId: 'fdsa',
    departmentId: 'asdf',
    __user__: { id: 'fdsa', name: 'Test User' }
  }
  */

  // userDepartments.forEach(du => {
  //   if (du.departmentId in departmentIdToUsers) {
  //     departmentIdToUsers[du.departmentId].push();
  //   }
  // })

  return departmentIds.map(deptId => departmentIdToUsers[deptId]);
};

export const createUsersLoader = () => new DataLoader(batchUsers);
