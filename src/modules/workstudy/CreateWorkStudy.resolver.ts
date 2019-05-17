import { Resolver, Mutation, Arg } from 'type-graphql';

import { WorkStudyInput } from './create/WorkStudyInput';
import { WorkStudy } from '../../entity/WorkStudy';

@Resolver()
export class CreateWorkStudy {
  @Mutation(() => WorkStudy)
  async createWorkStudy(
    @Arg('data')
    data: WorkStudyInput
  ): Promise<WorkStudy> {
    return WorkStudy.create(data).save();
  }
}
