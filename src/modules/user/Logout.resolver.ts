import { Resolver, Ctx, Mutation } from 'type-graphql';
import { MyContext } from '../../types/MyContext';

@Resolver()
export class LogoutResolver {
  @Mutation(() => Boolean)
  async logout(@Ctx() ctx: MyContext) {
    return new Promise((resolve, reject) =>
      ctx.req.session!.destroy(err => {
        if (err) {
          console.log(err);
          reject(false);
        }

        resolve(true);
      })
    );
  }
}
