import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Action } from '../../actions/entities/action.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { Achievement } from '../../achievements/entities/achievement.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  nom: string;

  @Column({ unique: true, length: 8 })
  code: string;

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable()
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
