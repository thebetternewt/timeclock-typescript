import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
  Column,
} from 'typeorm';
import { User } from './User';
import { Department } from './Department';

@Entity()
export class UserDepartment extends BaseEntity {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  deptId: string;

  @Column({ default: false })
  supervisor: boolean;

  @ManyToOne(() => User, user => user.departmentConnection)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @ManyToOne(() => Department, dept => dept.userConnection, { primary: true })
  @JoinColumn({ name: 'deptId' })
  department: Promise<Department>;
}
