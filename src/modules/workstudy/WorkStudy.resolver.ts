import { Resolver, Query } from 'type-graphql';

import { WorkStudy } from '../../entity/WorkStudy';

@Resolver()
export class WorkStudyResolver {
  @Query(() => [WorkStudy])
  async allWorkStudy(): Promise<WorkStudy[]> {
    return WorkStudy.find();
  }
}
