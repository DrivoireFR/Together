import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { User } from './User';
import { Task } from './Task';
import { Action } from './Action';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsNotEmpty()
  nom: string;

  @ManyToMany(() => User, user => user.groups)
  @JoinTable()
  users: User[];

  @OneToMany(() => Task, task => task.group)
  tasks: Task[];

  @OneToMany(() => Action, action => action.group)
  actions: Action[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}