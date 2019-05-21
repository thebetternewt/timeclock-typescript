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
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { WorkStudyPeriod } from './WorkStudyPeriod';
import { User } from './User';
import { Department } from './Department';
import { UserInputError } from 'apollo-server-core';

@ObjectType()
@Entity()
export class WorkStudy extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  deptId: string;

  @Field()
  @Column('date')
  startDate: string;

  @Field()
  @Column('date')
  endDate: string;

  @Column()
  workStudyPeriodId: string;

  @Field(() => Int)
  @Column('int', { default: 0 })
  amount: number;

  @Field(() => User)
  @ManyToOne(() => User, user => user.workStudyConnection)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @Field(() => Department)
  @ManyToOne(() => Department, dept => dept.workStudyConnection)
  @JoinColumn({ name: 'deptId' })
  department: Promise<Department>;

  @Field(() => WorkStudyPeriod)
  @ManyToOne(
    () => WorkStudyPeriod,
    (period: WorkStudyPeriod) => period.workStudyConnection
  )
  @JoinColumn({ name: 'workStudyPeriodId' })
  workStudyPeriod: Promise<WorkStudyPeriod>;

  @BeforeInsert()
  @BeforeUpdate()
  async validateDateRange(): Promise<boolean> {
    const ws = await WorkStudy.findOne({
      where: [
        // Start date is not between another period's start and end dates
        // for a given user & department.
        {
          userId: this.userId,
          deptId: this.deptId,
          startDate: LessThanOrEqual(this.startDate),
          endDate: MoreThanOrEqual(this.startDate),
        },
        // End date is not between another period's start and end dates
        // for a given user & department.
        {
          userId: this.userId,
          deptId: this.deptId,
          startDate: LessThanOrEqual(this.endDate),
          endDate: MoreThanOrEqual(this.endDate),
        },
        // Start and end dates do not completely encapsulate another period
        // for a given user & department.
        {
          userId: this.userId,
          deptId: this.deptId,
          startDate: MoreThanOrEqual(this.startDate),
          endDate: LessThanOrEqual(this.endDate),
        },
      ],
    });

    if (ws && ws.id !== this.id) {
      throw new UserInputError(
        'Overlapping period already exists for this user and department.'
      );
    }

    // Check if dates are outside of selected work study period.
    const period = await WorkStudyPeriod.findOne(this.workStudyPeriodId);

    console.log(this.startDate);
    console.log(period);

    if (!period) {
      throw new UserInputError('Work study period not found.');
    }

    if (this.startDate < period.startDate || this.endDate > period.endDate) {
      throw new UserInputError(
        'Dates are outside of the selected work study period.'
      );
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
