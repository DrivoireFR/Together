import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, Unique } from 'typeorm';
import { User } from './User';
import { Task } from './Task';

@Entity()
@Unique(['user', 'task'])
export class UserTaskState {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user: User) => user.taskStates)
  user: User;

  @ManyToOne(() => Task, (task: Task) => task.userStates)
  task: Task;

  @Column({ type: 'boolean', default: false })
  isAcknowledged: boolean;

  @Column({ type: 'boolean', default: false })
  isConcerned: boolean;

  @Column({ type: 'datetime', nullable: true })
  acknowledgedAt?: Date;

  @Column({ type: 'datetime', nullable: true })
  concernedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}