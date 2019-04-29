import { Request, Response } from 'express';
import { createUsersLoader } from '../modules/utils/usersLoader';
import { createSupervisorsLoader } from '../modules/utils/supervisorsLoader';
import { createSupervisedDepartmentsLoader } from '../modules/utils/supervisedDepartmentsLoader';
import { createDepartmentsLoader } from '../modules/utils/departmentsLoader';

export interface MyContext {
  req: Request;
  res: Response;
  usersLoader: ReturnType<typeof createUsersLoader>;
  supervisorsLoader: ReturnType<typeof createSupervisorsLoader>;
  supervisedDepartmentsLoader: ReturnType<
    typeof createSupervisedDepartmentsLoader
  >;
  departmentsLoader: ReturnType<typeof createDepartmentsLoader>;
}
