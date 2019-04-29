import { Request, Response } from 'express';
import { createUsersLoader } from '../modules/utils/usersLoader';

export interface MyContext {
  req: Request;
  res: Response;
  usersLoader: ReturnType<typeof createUsersLoader>;
}
