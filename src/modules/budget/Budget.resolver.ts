import { ForbiddenError } from 'apollo-server-core';
import { MyContext } from './../../types/MyContext';
import {
	Resolver,
	UseMiddleware,
	Query,
	Arg,
	Int,
	Ctx,
	FieldResolver,
	Root,
	ID,
} from 'type-graphql';
import { Budget } from '../../entity/Budget';
import { isAuth } from '../middleware/isAuth';
import { isSupervisor } from '../utils/isSupervisor';
import { Shift } from '../../entity/Shift';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import {
	startOfDay,
	endOfDay,
	format,
	isBefore,
	isAfter,
	getHours,
	differenceInMinutes,
	parse,
} from 'date-fns';
import { BudgetSummary } from './summary/BudgetSummaryInterface';
import { WorkStudy } from '../../entity/WorkStudy';

@Resolver(() => Budget)
export class BudgetResolver {
	@UseMiddleware(isAuth)
	@Query(() => Budget)
	async budget(
		@Ctx() ctx: MyContext,
		@Arg('fiscalYear', () => Int) fiscalYear: number,
		@Arg('deptId', () => ID) deptId: string
	): Promise<Budget | undefined> {
		if (!isSupervisor(ctx, deptId)) {
			throw new ForbiddenError('Not authorized!');
		}
		return Budget.findOne({ deptId, fiscalYear });
	}

	@FieldResolver(() => BudgetSummary)
	async summary(@Root() parent: Budget): Promise<BudgetSummary> {
		// Find all shifts associated with current budget.
		const shifts = await Shift.find({
			where: {
				deptId: parent.deptId,
				timeIn: Between(
					startOfDay(new Date(parent.fiscalYear - 1, 7, 1)),
					endOfDay(new Date(parent.fiscalYear, 6, 30))
				),
			},
		});

		console.log('# shifts:', shifts.length);
		console.log('first 5:', shifts.slice(0, 4));

		const wsShifts: Shift[] = [];
		const wageShifts: Shift[] = [];
		let totalNightShiftMinutes: number = 0;

		// Iterate through shifts and assign to work study or wages array.
		await Promise.all(
			shifts.map(async shift => {
				// Search for a matching workStudyPeriod.
				const wsPeriod = await WorkStudy.findOne({
					userId: shift.userId,
					deptId: shift.deptId,
					startDate: LessThanOrEqual(format(shift.timeIn, 'YYYY-MM-DD')),
					endDate: MoreThanOrEqual(format(shift.timeIn, 'YYYY-MM-DD')),
				});

				if (wsPeriod) {
					// If a period is found, assign shift to work study shifts array.
					wsShifts.push(shift);
				} else {
					// Else, assign shift to wage shifts array.
					wageShifts.push(shift);
				}

				// Get night shift minutes.
				let nightShiftMinutes = 0;

				const midnight = endOfDay(shift.timeIn);
				console.log('midnight:', midnight);
				// If shift crosses midnight...
				if (
					isBefore(shift.timeIn, midnight) &&
					isAfter(shift.timeOut, midnight)
				) {
					// If time out is before 7:00am...
					if (getHours(shift.timeOut) < 7) {
						// Calc number of minutes passed since midnight.
						nightShiftMinutes = differenceInMinutes(shift.timeOut, midnight);
					} else {
						// Calc total number of minutes passed between midnight and cutoff (7:00am)
						nightShiftMinutes = 7 * 60; // 7 hours in minutes
					}

					// Else if clock in is after midnight and before 7:00am...
				} else if (getHours(shift.timeIn) < 7) {
					// If time out is before 7:00am...
					if (getHours(shift.timeOut) < 7) {
						// Calc total minutes elapsed in shift.
						nightShiftMinutes = differenceInMinutes(
							shift.timeOut,
							shift.timeIn
						);
					} else {
						// Calc total number of minutes passed between time in and cutoff (7:00am)
						let sevenAm = parse(shift.timeIn).setHours(7, 0, 0);
						nightShiftMinutes = differenceInMinutes(sevenAm, shift.timeIn);
					}
				}

				totalNightShiftMinutes += nightShiftMinutes;

				console.log('timeIn:', format(shift.timeIn, 'YYYY-MM-DD h:mm a'));
				console.log('timeIn:', shift.timeIn);
				console.log('timeOut:', format(shift.timeOut, 'YYYY-MM-DD h:mm a'));
				console.log('timeOut:', shift.timeOut);
				if (nightShiftMinutes > 0) {
					console.log('night min:', nightShiftMinutes);
				}
			})
		);

		console.log('wsShifts:', wsShifts.length);
		console.log('wageShifts:', wageShifts.length);
		console.log('totalNightShiftMinutes:', totalNightShiftMinutes);

		// Helper function for getting total minutes elapsed from array of shifts.
		const getTotalMinutes = (shifts: Shift[]): number =>
			shifts.reduce((totalMinutes, shift) => {
				const newTotal = totalMinutes + shift.minutesElapsed;
				return newTotal;
			}, 0);

		// Get total work study minutes from work study shifts.
		const totalWsMinutes: number = getTotalMinutes(wsShifts);

		// Total work study expenditures in cents
		const totalWorkStudyExpenditures: number = Math.round(
			(totalWsMinutes / 60) * 7.25 * 0.3 * 100
		);

		// Get total wage minutes from work study shifts.
		const totalWageMinutes: number = getTotalMinutes(wageShifts);

		// Total work study expenditures in cents
		const totalWageExpenditures: number = Math.round(
			(totalWageMinutes / 60) * 7.25 * 100
		);

		const totalNightShiftExpenditures = Math.round(
			(totalNightShiftMinutes / 60) * 1.0 * 100
		);

		// Construct summary object.
		const summary: BudgetSummary = new BudgetSummary();
		summary.totalExpenditures =
			totalWageExpenditures +
			totalWorkStudyExpenditures +
			totalNightShiftExpenditures;
		summary.totalWageExpenditures = totalWageExpenditures;
		summary.totalNightShiftExpenditures = totalNightShiftExpenditures;
		summary.totalWorkStudyExpenditures = totalWorkStudyExpenditures;

		console.log(summary);

		return summary;
	}
}
