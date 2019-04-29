import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID, Ctx } from 'type-graphql';

import { User } from './User';
import { UserDepartment } from './UserDepartment';
import { MyContext } from '../types/MyContext';

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
  async users(@Ctx() { usersLoader }: MyContext): Promise<User[]> {
    return usersLoader.load(this.id);
  }

  @Field(() => [User], { defaultValue: [] })
  async supervisors(@Ctx() { supervisorsLoader }: MyContext): Promise<User[]> {
    return supervisorsLoader.load(this.id);
  }
}
