import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  Index,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Action } from '../../actions/entities/action.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { Achievement } from '../../achievements/entities/achievement.entity';

@Entity()
@Index(['nom'])
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  nom: string;

  @Column({ unique: true, length: 8 })
  code: string;

  @OneToMany(() => User, (user) => user.group)
  users: User[];

  @OneToMany(() => Task, (task) => task.group)
  tasks: Task[];

  @OneToMany(() => Action, (action) => action.group)
  actions: Action[];

  @OneToMany(() => Tag, (tag) => tag.group)
  tags: Tag[];

  @OneToMany(() => Achievement, (achievement) => achievement.group)
  achievements: Achievement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.code = result;
  }
}
