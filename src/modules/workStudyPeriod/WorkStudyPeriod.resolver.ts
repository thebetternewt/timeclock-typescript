import { Resolver, Query, Arg, ID, Int } from 'type-graphql';
import { WorkStudyPeriod } from '../../entity/WorkStudyPeriod';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import moment = require('moment');

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
		@Arg('id', () => ID, {
			nullable: true,
			description:
				'Returns a single work study period based on the id, then date. Returns the current work study period if no params specified.',
		})
		id?: string
	): Promise<WorkStudyPeriod | undefined> {
		if (id) {
			return WorkStudyPeriod.findOne(id);
		}
		return WorkStudyPeriod.findOne({
			startDate: LessThanOrEqual(moment().toISOString()),
			endDate: MoreThanOrEqual(moment().toISOString()),
		});
	}
}
