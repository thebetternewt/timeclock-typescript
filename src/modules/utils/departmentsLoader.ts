import DataLoader from 'dataloader';
import { In } from 'typeorm';

import { Department } from '../../entity/Department';
import { UserDepartment } from '../../entity/UserDepartment';

const batchDepartments = async (userIds: string[]) => {
  // Inner Join User and Department tables and select were department Id is
  // in list of department Ids and user is supervisor.
  const userDepartments = await UserDepartment.find({
    join: {
      alias: 'userDepartment',
      innerJoinAndSelect: {
        department: 'userDepartment.department',
      },
    },
    where: {
      userId: In(userIds),
    },
  });

  const userIdToDeptIds: { [key: string]: Department[] } = {};

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
    if (du.userId in userIdToDeptIds) {
      userIdToDeptIds[du.userId].push((du as any).__department__);
    } else {
      userIdToDeptIds[du.userId] = [(du as any).__department__];
    }
  });

  // console.log('userDepartments:', userDepartments);

  return userIds.map(userId => userIdToDeptIds[userId]);
};

export const createDepartmentsLoader = () => new DataLoader(batchDepartments);
