import { Resolver, Mutation, Arg } from 'type-graphql';
import { WorkStudyPeriodInput } from './create/WorkStudyPeriodInput';
import { WorkStudyPeriod } from '../../entity/WorkStudyPeriod';

@Resolver()
export class CreateWorkStudyPeriodResolver {
  @Mutation(() => WorkStudyPeriod)
  async createWorkStudyPeriod(
    @Arg('data')
    data: WorkStudyPeriodInput
  ): Promise<WorkStudyPeriod> {
    return WorkStudyPeriod.create(data).save();
  }
}
