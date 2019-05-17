import { ObjectType, Field, ID, Int } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';
import { WorkStudy } from './WorkStudy';
import { UserInputError } from 'apollo-server-core';

@ObjectType()
@Entity()
export class WorkStudyPeriod extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Int)
  @Column('int')
  year: number;

  @Field({ description: "A descriptive name for the period, e.g. 'SPRING'" })
  @Column()
  name: string;

  @Field()
  @Column('date')
  startDate: string;

  @Field()
  @Column('date')
  endDate: string;

  @OneToMany(() => WorkStudy, (ws: WorkStudy) => ws.workStudyPeriod)
  workStudyConnection: Promise<WorkStudy[]>;

  @BeforeInsert()
  @BeforeUpdate()
  async validateDateRange(): Promise<boolean> {
    const period = await WorkStudyPeriod.findOne({
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
