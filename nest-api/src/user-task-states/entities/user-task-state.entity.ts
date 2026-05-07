import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
@Unique(['user', 'task'])
@Index(['user', 'task'])
export class UserTaskState {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.taskStates)
  user: User;

  @ManyToOne(() => Task, (task) => task.userStates, {
    onDelete: 'CASCADE',
  })
  task: Task;

  @Column({ type: 'boolean', default: false })
  isAcknowledged: boolean;

  @Column({ type: 'timestamp', nullable: true })
  acknowledgedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
