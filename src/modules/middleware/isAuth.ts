import { MiddlewareFn } from 'type-graphql';
import { AuthenticationError } from 'apollo-server-core';

import { MyContext } from '../../types/MyContext';

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session!.userId) {
    throw new AuthenticationError('Not authenticated!');
  }

  return next();
};
