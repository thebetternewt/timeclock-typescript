import { Resolver, Mutation, Arg, ID } from 'type-graphql';
import { WorkStudy } from '../../entity/WorkStudy';

@Resolver()
export class DeleteWorkStudyResolver {
  @Mutation(() => Boolean)
  async deleteWorkStudy(
    @Arg('id', () => ID)
    id: string
  ): Promise<boolean> {
    const workStudy = await WorkStudy.findOne(id);

    if (!workStudy) {
      return false;
    }

    await workStudy.remove();

    return true;
  }
}
