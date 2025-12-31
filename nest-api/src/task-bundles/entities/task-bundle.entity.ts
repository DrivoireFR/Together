import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Task } from '../../tasks/entities/task.entity';
import { User } from '../../users/entities/user.entity';
import { Group } from '../../groups/entities/group.entity';

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
