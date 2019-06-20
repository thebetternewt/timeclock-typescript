import {
	Entity,
	Column,
	BaseEntity,
	PrimaryGeneratedColumn,
	OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID, Ctx, Root } from 'type-graphql';

import { MyContext } from '../types/MyContext';
import { User } from './User';
import { UserDepartment } from './UserDepartment';
import { Shift } from './Shift';
import { isSupervisor } from '../modules/utils/isSupervisor';
import { WorkStudy } from './WorkStudy';
import { Budget } from './Budget';

@ObjectType()
@Entity()
export class Department extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Field()
	@Column({ unique: true })
	name: string;

	@OneToMany(() => UserDepartment, ud => ud.department)
	userConnection: Promise<UserDepartment[]>;

	@Field(() => [User])
	async users(
		@Root() parent: Department,
		@Ctx() ctx: MyContext
	): Promise<User[] | null> {
		// Check if user is supervisor before returning list of users.
		if (await isSupervisor(ctx, parent.id)) {
			const users = (await ctx.usersLoader.load(this.id)) || [];
			return users;
		}

		return [];
	}

	@Field(() => [User])
	async supervisors(@Ctx() { supervisorsLoader }: MyContext): Promise<User[]> {
		const supervisors = (await supervisorsLoader.load(this.id)) || [];
		return supervisors;
	}

	@OneToMany(() => Shift, shift => shift.department)
	shiftConnection: Promise<Shift[]>;

	@Field(() => [Shift], { defaultValue: [] })
	async shifts(
		@Root() parent: Department,
		@Ctx() ctx: MyContext
	): Promise<Shift[]> {
		// Check if user is supervisor before returning list of shifts.
		if (await isSupervisor(ctx, parent.id)) {
			return Shift.find({ deptId: parent.id });
		}

		return [];
	}

	@OneToMany(() => WorkStudy, ws => ws.department)
	workStudyConnection: Promise<WorkStudy[]>;

	@Field(() => [WorkStudy], { defaultValue: [] })
	async workStudy(
		@Root() parent: Department,
		@Ctx() ctx: MyContext
	): Promise<WorkStudy[]> {
		// Check if user is supervisor before returning list of shifts.
		if (await isSupervisor(ctx, parent.id)) {
			return WorkStudy.find({ deptId: parent.id });
		}

		return [];
	}

	@OneToMany(() => Budget, budget => budget.department)
	budgetConnection: Promise<Budget[]>;

	@Field(() => [Budget], { defaultValue: [] })
	async budgets(
		@Root() parent: Department,
		@Ctx() ctx: MyContext
	): Promise<Budget[]> {
		// Check if user is supervisor before returning list of budgets.
		if (await isSupervisor(ctx, parent.id)) {
			return Budget.find({ deptId: parent.id });
		}

		return [];
	}
}
