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
@Index(['user', 'task']) // Index pour les requêtes par utilisateur et tâche
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
