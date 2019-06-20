import { Resolver, Query, Arg, ID } from 'type-graphql';

import { WorkStudy } from '../../entity/WorkStudy';
import { WorkStudyPeriod } from '../../entity/WorkStudyPeriod';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import moment = require('moment');
import { UserInputError } from 'apollo-server-core';

@Resolver()
export class AllWorkStudyResolver {
	@Query(() => [WorkStudy])
	async allWorkStudy(
		@Arg('userId', () => ID) userId: string
	): Promise<WorkStudy[]> {
		return WorkStudy.find({ userId });
	}
}

@Resolver()
export class WorkStudyResolver {
	@Query(() => WorkStudy, { nullable: true })
	async workStudy(
		@Arg('userId', () => ID) userId: string,
		@Arg('deptId', () => ID) deptId: string
	): Promise<WorkStudy | undefined> {
		const currentPeriod = await WorkStudyPeriod.findOne({
			startDate: LessThanOrEqual(moment().toISOString()),
			endDate: MoreThanOrEqual(moment().toISOString()),
		});

		console.log(currentPeriod);

		if (!currentPeriod) {
			throw new UserInputError(
				'User has no workstudy record during this period.'
			);
		}

		const ws = await WorkStudy.findOne({
			userId,
			deptId,
			workStudyPeriodId: currentPeriod.id,
		});

		console.log('ws:', ws);

		return ws;
	}
}
