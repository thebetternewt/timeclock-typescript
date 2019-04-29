import { ObjectType, Field, ID, Int } from 'type-graphql';
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Department } from './Department';
import { User } from './User';

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
  totalTime: number;

  @Column()
  userId: string;

  @Column()
  deptId: string;

  @ManyToOne(() => User, user => user.shiftConnection)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @ManyToOne(() => Department, dept => dept.shiftConnection)
  @JoinColumn({ name: 'deptId' })
  department: Promise<Department>;
}
