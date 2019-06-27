import { Max, Min } from 'class-validator';
import { Field, ID, Int, ObjectType } from 'type-graphql';
import {
	BaseEntity,
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	LessThanOrEqual,
	MoreThanOrEqual,
} from 'typeorm';
import { Semester } from '../modules/payPeriod/createPayPeriod/PayPeriodInput';
import { UserInputError } from 'apollo-server-core';

export type SemesterType = 'spring' | 'summer' | 'fall';

@ObjectType()
@Entity()
export class PayPeriod extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Field(() => String)
	@Column('date')
	startDate: string;

	@Field(() => String)
	@Column('date')
	endDate: string;

	@Field(() => Int)
	@Min(2000)
	@Max(2999)
	@Column('int')
	fiscalYear: number;

	@Field(() => Int)
	@Min(2000)
	@Max(2999)
	@PrimaryColumn('int')
	year: number;

	@Field(() => Int)
	@PrimaryColumn('int')
	payPeriodId: number;

	@Field(() => Semester)
	@Column({ type: 'enum', enum: ['spring', 'summer', 'fall'] })
	semester: SemesterType;

	@BeforeInsert()
	@BeforeUpdate()
	async validateDateRange(): Promise<boolean> {
		const period = await PayPeriod.findOne({
			where: [
				// Start date is not between another period's start and end dates.
				{
					startDate: LessThanOrEqual(this.startDate),
					endDate: MoreThanOrEqual(this.startDate),
				},
				// End date is not between another period's start and end dates.
				{
					startDate: LessThanOrEqual(this.endDate),
					endDate: MoreThanOrEqual(this.endDate),
				},
				// Start and end dates do not completely encapsulate another period.
				{
					startDate: MoreThanOrEqual(this.startDate),
					endDate: LessThanOrEqual(this.endDate),
				},
			],
		});

		if (period && period.id !== this.id) {
			throw new UserInputError('Overlapping period already exists.');
		}

		return true;
	}

	@BeforeInsert()
	@BeforeUpdate()
	async validateEndDate(): Promise<boolean> {
		if (this.endDate < this.startDate) {
			throw new UserInputError('End date must be after start date.');
		}

		return true;
	}
}
