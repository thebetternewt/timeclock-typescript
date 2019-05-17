import { Resolver, Mutation, Arg, ID } from 'type-graphql';
import { WorkStudyPeriodInput } from './create/WorkStudyPeriodInput';
import { WorkStudyPeriod } from '../../entity/WorkStudyPeriod';
import { UserInputError } from 'apollo-server-core';

@Resolver()
export class EditWorkStudyPeriodResolver {
  @Mutation(() => WorkStudyPeriod)
  async editWorkStudyPeriod(
    @Arg('id', () => ID) id: string,
    @Arg('data')
    { year, name, startDate, endDate }: WorkStudyPeriodInput
  ): Promise<WorkStudyPeriod> {
    const period = await WorkStudyPeriod.findOne(id);

    if (!period) {
      throw new UserInputError('Work study period not found.');
    }

    period.year = year;
    period.name = name;
    period.startDate = startDate;
    period.endDate = endDate;

    await period.save();

    return period;
  }
}
