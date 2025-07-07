import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Task } from './Task';
import { User } from './User';
import { Group } from './Group';

@Entity()
export class TaskBundle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  label: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToMany(() => Task)
  @JoinTable()
  tasks: Task[];

  @ManyToOne(() => User)
  createdBy: User;

  @ManyToOne(() => Group)
  group: Group;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}