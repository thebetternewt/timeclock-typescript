import { UserInputError } from 'apollo-server-core';
import { Resolver, Ctx, Mutation, UseMiddleware } from 'type-graphql';
import { IsNull, LessThanOrEqual, MoreThanOrEqual, Between } from 'typeorm';

import { Shift } from '../../entity/Shift';
import { MyContext } from '../../types/MyContext';
import { isAuth } from '../middleware/isAuth';
import { WorkStudy } from '../../entity/WorkStudy';
import { format, startOfDay, endOfDay, subDays } from 'date-fns';

@Resolver()
export class ClockOutResolver {
	@UseMiddleware(isAuth)
	@Mutation(() => Shift)
	async clockOut(@Ctx() { req }: MyContext): Promise<Shift> {
		const { userId } = req.session!;

		const shift = await Shift.findOne({ userId, timeOut: IsNull() });

		// Throw error if not clocked in.
		if (!shift) {
			throw new UserInputError('Not clocked in.');
		}

		shift.timeOut = new Date();

		await shift.save();

		// Check if user is out of workstudy
		const wsPeriod = await WorkStudy.findOne({
			userId: shift.userId,
			deptId: shift.deptId,
			startDate: LessThanOrEqual(format(shift.timeIn, 'YYYY-MM-DD')),
			endDate: MoreThanOrEqual(format(shift.timeIn, 'YYYY-MM-DD')),
		});

		// End work study if employee depletes all allocated funds.
		if (wsPeriod) {
			// Calculate total hours allocated for given work study period for user in this dept.
			const wsHoursAllocated = wsPeriod.amount / 7.25;

			// If a period is found, query all shifts in that period & dept for the user.
			const shifts = await Shift.find({
				userId,
				deptId: shift.deptId,
				timeIn: Between(
					startOfDay(wsPeriod.startDate),
					endOfDay(wsPeriod.endDate)
				),
			});

			// Calculate total minutes elapsed across all shifts
			const totalMinutesUsed = shifts.reduce(
				(totalMinutes, shift) => (totalMinutes += shift.minutesElapsed),
				0
			);

			console.log('totalMinutesUsed:', totalMinutesUsed);

			// Calculate total hours from minutes
			const totalHoursUsed = totalMinutesUsed / 60;

			// If hours used is greater than hours allocated, then set endDate to previos day.
			if (totalHoursUsed > wsHoursAllocated) {
				wsPeriod.endDate = format(subDays(shift.timeIn, 1), 'YYYY-MM-DD');
				await wsPeriod.save();
			}
		}

		return shift;
	}
}
