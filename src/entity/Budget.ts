import {
	Entity,
	BaseEntity,
	Column,
	PrimaryGeneratedColumn,
	JoinColumn,
	ManyToOne,
} from 'typeorm';
import { Field, Int, ID, ObjectType } from 'type-graphql';
import { Department } from './Department';

@ObjectType()
@Entity()
export class Budget extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('uuid')
	deptId: string;

	@Field(() => Int)
	@Column('int')
	amount: number;

	@Field(() => Int)
	@Column('int')
	fiscalYear: number;

	@Field(() => Department)
	@ManyToOne(() => Department, dept => dept.budgetConnection)
	@JoinColumn({ name: 'deptId' })
	department: Promise<Department>;
}
