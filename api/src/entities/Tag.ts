import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsHexColor } from 'class-validator';
import { Task } from './Task';
import { Group } from './Group';
import { Congrats } from './Congrats';

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

  @Column({ default: false })
  isDefault: boolean;

  @ManyToOne(() => Group, group => group.tags)
  group: Group;

  @OneToMany(() => Task, task => task.tag)
  tasks: Task[];

  @OneToMany(() => Congrats, congrats => congrats.tag)
  congrats: Congrats[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}