import { ObjectType, Field, ID, Int } from 'type-graphql';
import {
	Entity,
	BaseEntity,
	PrimaryGeneratedColumn,
	Column,
	PrimaryColumn,
} from 'typeorm';
import { Semester } from '../modules/payPeriod/createPayPeriod/PayPeriodInput';
import { Min, Max } from 'class-validator';

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
}
