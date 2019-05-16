import { ObjectType, Field, ID, Int } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { WorkStudy } from './WorkStudy';

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
}
