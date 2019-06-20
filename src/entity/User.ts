import {
	Entity,
	Column,
	BaseEntity,
	PrimaryGeneratedColumn,
	BeforeInsert,
	BeforeUpdate,
	OneToMany,
	IsNull,
} from 'typeorm';
import { ObjectType, Field, ID, Root, Ctx } from 'type-graphql';
import { hash } from 'bcryptjs';
import { UserDepartment } from './UserDepartment';
import { Department } from './Department';
import { MyContext } from '../types/MyContext';
import { Shift } from './Shift';
import { WorkStudy } from './WorkStudy';
import { isCurrentUser } from '../modules/utils/isCurrentUser';
import { Dsf } from './Dsf';

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field(() => ID)
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Field()
	@Column({ unique: true })
	netId: string;

	@Field()
	@Column({ unique: true })
	nineDigitId: string;

	@Field()
	@Column()
	firstName: string;

	@Field()
	@Column()
	lastName: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	phone?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	street1?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	street2?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	city?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	state?: string;

	@Field({ nullable: true })
	@Column({ nullable: true })
	zip?: string;

	@Field()
	name(@Root() parent: User): string {
		return `${parent.firstName} ${parent.lastName}`;
	}

	@Field(() => Boolean)
	async dsf(@Root() { id }: User): Promise<boolean> {
		const dsf = await Dsf.findOne({ userId: id });

		if (!dsf) return false;

		return true;
	}

	@Field()
	@Column({ default: false })
	admin: boolean;

	@Field(() => Boolean)
	async supervisor(@Root() parent: User): Promise<boolean> {
		const userDept = await UserDepartment.findOne({
			userId: parent.id,
			supervisor: true,
		});

		if (userDept) {
			return true;
		}

		return false;
	}

	@Field()
	@Column({ default: true })
	active: boolean;

	@Field()
	@Column('text', { unique: true })
	email: string;

	@Column({ nullable: true })
	password?: string;

	@Field(() => Shift, { nullable: true })
	async lastShift(@Root() parent: User): Promise<Shift | undefined> {
		return Shift.findOne({ userId: parent.id }, { order: { timeIn: 'DESC' } });
	}

	@Field(() => Boolean)
	async isClockedIn(@Root() parent: User): Promise<boolean> {
		const shift = await Shift.findOne({ userId: parent.id, timeOut: IsNull() });
		return !!shift;
	}

	@BeforeInsert()
	@BeforeUpdate()
	async hashPassword() {
		if (this.password) {
			this.password = await hash(this.password, 12);
		}
	}

	@BeforeInsert()
	@BeforeUpdate()
	async lowercaseEmail() {
		this.email = this.email.toLowerCase();
	}

	@OneToMany(() => UserDepartment, ud => ud.user)
	departmentConnection: Promise<UserDepartment[]>;

	@Field(() => [Department], { defaultValue: [] })
	async departments(@Ctx()
	{
		departmentsLoader,
	}: MyContext): Promise<Department[]> {
		const departments = await departmentsLoader.load(this.id);
		return departments || [];
	}

	@Field(() => [Department], { defaultValue: [] })
	async supervisedDepartments(@Ctx()
	{
		supervisedDepartmentsLoader,
	}: MyContext): Promise<Department[]> {
		const departments = await supervisedDepartmentsLoader.load(this.id);
		return departments || [];
	}

	@OneToMany(() => Shift, (shift: Shift) => shift.user)
	shiftConnection: Promise<Shift[]>;

	@Field(() => [Shift], { defaultValue: [] })
	async shifts(@Root() parent: User) {
		return Shift.find({ userId: parent.id });
	}

	@OneToMany(() => WorkStudy, (ws: WorkStudy) => ws.user)
	workStudyConnection: Promise<WorkStudy[]>;

	@Field(() => [WorkStudy], { name: 'workStudy' })
	async workStudy(@Root() parent: User, @Ctx() ctx: MyContext) {

		if (
			ctx.req.session!.isAdmin || // is Admin
			(await isCurrentUser(ctx, parent)) // is Current User
		) {
			return WorkStudy.find({ userId: parent.id });
		}

		return [];
	}
}
