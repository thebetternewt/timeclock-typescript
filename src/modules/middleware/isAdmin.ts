import { MiddlewareFn } from 'type-graphql';
import { ForbiddenError } from 'apollo-server-core';

import { MyContext } from '../../types/MyContext';

export const isAdmin: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session!.isAdmin) {
    throw new ForbiddenError('Not authorized!');
  }

  return next();
};
