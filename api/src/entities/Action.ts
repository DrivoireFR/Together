import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsDate } from 'class-validator';
import { Task } from './Task';
import { User } from './User';
import { Group } from './Group';

@Entity()
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDate()
  date: Date;

  @Column({ type: 'boolean', default: false })
  isHelpingHand: boolean;

  @ManyToOne(() => Task, task => task.actions, {
    onDelete: 'CASCADE'
  })
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