import {
  Entity,
  Column,
  BaseEntity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm'
import { ObjectType, Field, ID, Root } from 'type-graphql'
import { hash } from 'bcryptjs'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column({ unique: true })
  netId: string

  @Field()
  @Column({ unique: true })
  nineDigitId: string

  @Field()
  @Column()
  firstName: string

  @Field()
  @Column()
  lastName: string

  @Field({ complexity: 3 })
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`
  }

  @Field()
  @Column({ default: false })
  admin: boolean

  @Field()
  @Column({ default: true })
  active: boolean

  @Field()
  @Column('text', { unique: true })
  email: string

  @Column()
  password: string

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await hash(this.password, 12)
  }

  @BeforeInsert()
  @BeforeUpdate()
  async lowercaseEmail() {
    this.email = this.email.toLowerCase()
  }
}
