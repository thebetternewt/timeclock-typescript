import { Resolver, Ctx, Mutation } from 'type-graphql'
import { MyContext } from '../../types/MyContext'
import { SESS_NAME } from '../../config'

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext): Promise<boolean> {
    return new Promise((resolve, reject) =>
      req.session!.destroy(err => {
        if (err) {
          console.log(err)
          return reject(false)
        }

        res.clearCookie(SESS_NAME)

        return resolve(true)
      })
    )
  }
}
