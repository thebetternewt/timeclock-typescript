import { Resolver, Query, Arg, ID, Int } from 'type-graphql';
import { WorkStudyPeriod } from '../../entity/WorkStudyPeriod';

@Resolver()
export class AllWorkStudyPeriodResolver {
  @Query(() => [WorkStudyPeriod])
  async allWorkStudyPeriod(
    @Arg('year', () => Int, { nullable: true }) year?: number
  ): Promise<WorkStudyPeriod[]> {
    interface WorkStudyPeriodSearchParams {
      year?: number;
    }

    const searchParams: WorkStudyPeriodSearchParams = {};

    if (year) {
      searchParams.year = year;
    }

    const periods = await WorkStudyPeriod.find(searchParams);

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
