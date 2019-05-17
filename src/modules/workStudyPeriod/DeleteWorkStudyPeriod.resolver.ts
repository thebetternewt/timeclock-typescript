import { Resolver, Mutation, Arg, ID } from 'type-graphql';
import { WorkStudyPeriod } from '../../entity/WorkStudyPeriod';

@Resolver()
export class DeleteWorkStudyPeriodResolver {
  @Mutation(() => Boolean)
  async deleteWorkStudyPeriod(
    @Arg('id', () => ID)
    id: string
  ): Promise<boolean> {
    const period = await WorkStudyPeriod.findOne(id);

    if (!period) {
      return false;
    }

    await period.remove();

    return true;
  }
}
