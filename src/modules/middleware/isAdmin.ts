import { MiddlewareFn } from 'type-graphql'
import { AuthenticationError } from 'apollo-server-core'

import { MyContext } from '../../types/MyContext'

export const isAdmin: MiddlewareFn<MyContext> = async ({ context }, next) => {
  if (!context.req.session!.isAdmin) {
    throw new AuthenticationError('Not authorized!')
  }

  return next()
}
