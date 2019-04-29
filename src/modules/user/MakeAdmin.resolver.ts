import { Resolver, Ctx, Mutation, UseMiddleware } from 'type-graphql'
import { MyContext } from '../../types/MyContext'
import { isAdmin } from '../middleware/isAdmin'

@Resolver()
export class MakeAdminResolver {
  @UseMiddleware(isAdmin)
  @Mutation(() => Boolean)
  async makeAdmin(@Ctx() { req }: MyContext): Promise<boolean> {
    console.log('session:', req.session)

    return true
  }
}
