import { Entity, BaseEntity, PrimaryColumn } from 'typeorm';

@Entity()
export class Dsf extends BaseEntity {
	@PrimaryColumn()
	userId: string;
}
