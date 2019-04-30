import { ObjectType, Field, ID, Int } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Department } from './Department';
import { User } from './User';
import { UserInputError } from 'apollo-server-core';
import moment = require('moment');

@ObjectType()
@Entity()
export class Shift extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('timestamp with time zone')
  timeIn: Date;

  @Field({ nullable: true })
  @Column('timestamp with time zone', { nullable: true })
  timeOut: Date;

  @Field(() => Int, { nullable: true })
  @Column('int', { nullable: true })
  minutesElapsed: number;

  @Column()
  userId: string;

  @Column()
  deptId: string;

  @Field(() => User)
  @ManyToOne(() => User, user => user.shiftConnection)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @Field(() => Department)
  @ManyToOne(() => Department, dept => dept.shiftConnection)
  @JoinColumn({ name: 'deptId' })
  department: Promise<Department>;

  @BeforeInsert()
  @BeforeUpdate()
  async validateTimeOut(): Promise<boolean> {
    if (this.timeOut && this.timeOut < this.timeIn) {
      throw new UserInputError('Time out must be after time in.');
    }

    return true;
  }

  @BeforeInsert()
  @BeforeUpdate()
  async updateMinutesElapsed(): Promise<void> {
    if (this.timeOut) {
      this.minutesElapsed = moment(this.timeOut).diff(this.timeIn, 'minutes');
    }
  }
}
