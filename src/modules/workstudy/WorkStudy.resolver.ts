import { Resolver, Query, Arg, ID } from 'type-graphql';

import { WorkStudy } from '../../entity/WorkStudy';

@Resolver()
export class WorkStudyResolver {
  @Query(() => [WorkStudy])
  async allWorkStudy(
    @Arg('userId', () => ID) userId: string
  ): Promise<WorkStudy[]> {
    return WorkStudy.find({ userId });
  }
}
