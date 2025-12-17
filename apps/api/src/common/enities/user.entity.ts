import {
  Column,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';

import { Exclude } from 'class-transformer';

export enum Role {
  SEEKER = 'seeker',
  COUNSELOR = 'counselor',
  ADMIN = 'admin',
}

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'text' })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;
}
