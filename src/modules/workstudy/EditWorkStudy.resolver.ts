import { Resolver, Mutation, Arg, ID } from 'type-graphql';
import { WorkStudyInput } from './create/WorkStudyInput';
import { WorkStudy } from '../../entity/WorkStudy';
import { UserInputError } from 'apollo-server-core';

@Resolver()
export class EditWorkStudyResolver {
  @Mutation(() => WorkStudy)
  async editWorkStudy(
    @Arg('id', () => ID) id: string,
    @Arg('data')
    { userId, deptId, workStudyPeriodId, startDate, endDate }: WorkStudyInput
  ): Promise<WorkStudy> {
    const workStudy = await WorkStudy.findOne(id);

    if (!workStudy) {
      throw new UserInputError('Work study instance not found.');
    }

    workStudy.userId = userId;
    workStudy.deptId = deptId;
    workStudy.workStudyPeriodId = workStudyPeriodId;
    workStudy.startDate = startDate;
    workStudy.endDate = endDate;

    await workStudy.save();

    return workStudy;
  }
}
