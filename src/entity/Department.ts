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
      return ctx.usersLoader.load(this.id);
    }

    return [];
  }

  @Field(() => [User], { defaultValue: [] })
  async supervisors(@Ctx() { supervisorsLoader }: MyContext): Promise<User[]> {
    return supervisorsLoader.load(this.id);
  }

  @OneToMany(() => Shift, shift => shift.department)
  shiftConnection: Promise<Shift[]>;

  @Field(() => [Shift], { defaultValue: [] })
  async shifts(
    @Root() parent: Department,
    @Ctx() ctx: MyContext
  ): Promise<Shift[] | null> {
    // Check if user is supervisor before returning list of shifts.
    if (await isSupervisor(ctx, parent.id)) {
      return Shift.find({ deptId: parent.id });
    }

    return [];
  }
}
