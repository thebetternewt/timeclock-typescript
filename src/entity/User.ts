import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { ObjectType, Field, ID, Root, Ctx } from 'type-graphql';
import { hash } from 'bcryptjs';
import { UserDepartment } from './UserDepartment';
import { Department } from './Department';
import { MyContext } from '../types/MyContext';
import { Shift } from './Shift';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  netId: string;

  @Field()
  @Column({ unique: true })
  nineDigitId: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Field()
  @Column({ default: false })
  admin: boolean;

  @Field()
  @Column({ default: true })
  active: boolean;

  @Field()
  @Column('text', { unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await hash(this.password, 12);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async lowercaseEmail() {
    this.email = this.email.toLowerCase();
  }

  @OneToMany(() => UserDepartment, ud => ud.user)
  departmentConnection: Promise<UserDepartment[]>;

  @Field(() => [Department], { defaultValue: [] })
  async departments(@Ctx()
  {
    departmentsLoader,
  }: MyContext): Promise<Department[]> {
    return departmentsLoader.load(this.id);
  }

  @Field(() => [Department], { defaultValue: [] })
  async supervisedDepartments(@Ctx()
  {
    supervisedDepartmentsLoader,
  }: MyContext): Promise<Department[]> {
    return supervisedDepartmentsLoader.load(this.id);
  }

  @OneToMany(() => Shift, shift => shift.user)
  shiftConnection: Promise<Shift[]>;

  @Field(() => [Shift], { defaultValue: [] })
  async shifts(@Root() parent: User) {
    return Shift.find({ userId: parent.id });
  }
}
