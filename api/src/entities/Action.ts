import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsDateString } from 'class-validator';
import { Task } from './Task';
import { User } from './User';
import { Group } from './Group';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDateString()
  date: Date;

  @ManyToOne(() => Task, task => task.actions)
  task: Task;

  @ManyToOne(() => User, user => user.actions)
  user: User;

  @ManyToOne(() => Group, group => group.actions)
  group: Group;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}