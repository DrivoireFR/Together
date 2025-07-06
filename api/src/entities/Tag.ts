import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsHexColor } from 'class-validator';
import { Task } from './Task';
import { Group } from './Group';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  label: string;

  @Column()
  @IsHexColor()
  color: string;

  @ManyToOne(() => Group, group => group.tags)
  group: Group;

  @OneToMany(() => Task, task => task.tag)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}