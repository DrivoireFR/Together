import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { IsDate } from 'class-validator';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';

@Entity()
@Index(['date', 'group']) // Index pour les requêtes par groupe avec filtre date
@Index(['date', 'user']) // Index pour les requêtes par utilisateur avec filtre date
@Index(['date', 'task']) // Index pour les requêtes par tâche avec filtre date
export class Action {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsDate()
  date: Date;

  @Column({ type: 'boolean', default: false })
  isHelpingHand: boolean;

  @ManyToOne(() => Task, (task) => task.actions, {
    onDelete: 'CASCADE',
  })
  task: Task;

  @ManyToOne(() => User, (user) => user.actions)
  user: User;

  @ManyToOne(() => Group, (group) => group.actions)
  group: Group;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
