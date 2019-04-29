import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';
import { Department } from './Department';

@Entity()
export class UserDepartment extends BaseEntity {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  departmentId: string;

  @ManyToOne(() => User, user => user.departmentConnection)
  @JoinColumn({ name: 'userId' })
  user: Promise<User>;

  @ManyToOne(() => Department, dept => dept.userConnection, { primary: true })
  @JoinColumn({ name: 'departmentId' })
  department: Promise<Department>;
}
