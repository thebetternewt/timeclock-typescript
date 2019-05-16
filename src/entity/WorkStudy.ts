import { ObjectType, Field, ID } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkStudyPeriod } from './WorkStudyPeriod';

@ObjectType()
@Entity()
export class WorkStudy extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => ID)
  @Column()
  userId: string;

  @Field(() => ID)
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

  @Field(() => WorkStudyPeriod)
  @ManyToOne(
    () => WorkStudyPeriod,
    (period: WorkStudyPeriod) => period.workStudyConnection
  )
  @JoinColumn({ name: 'workStudyPeriodId' })
  workStudyPeriod: Promise<WorkStudyPeriod>;
}
