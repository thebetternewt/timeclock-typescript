import { Resolver, Query, Arg, ID } from 'type-graphql';
import { WorkStudyPeriod } from '../../entity/WorkStudyPeriod';

@Resolver()
export class AllWorkStudyPeriodResolver {
  @Query(() => [WorkStudyPeriod])
  async allWorkStudyPeriod(): Promise<WorkStudyPeriod[]> {
    const periods = await WorkStudyPeriod.find({});

    return periods;
  }
}

@Resolver()
export class WorkStudyPeriodResolver {
  @Query(() => WorkStudyPeriod)
  async workStudyPeriod(
    @Arg('id', () => ID) id: string
  ): Promise<WorkStudyPeriod | undefined> {
    const period = await WorkStudyPeriod.findOne(id);

    return period;
  }
}
