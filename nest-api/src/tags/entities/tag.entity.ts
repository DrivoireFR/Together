import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IsNotEmpty, IsHexColor } from 'class-validator';
import { Task } from '../../tasks/entities/task.entity';
import { Group } from '../../groups/entities/group.entity';
import { Congrats } from '../../congrats/entities/congrats.entity';
import { Icon } from '../enums/icon.enum';

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

  @Column({ type: 'simple-enum', enum: Icon, nullable: true })
  icon?: Icon;

  @ManyToOne(() => Group, (group) => group.tags)
  group: Group;

  @OneToMany(() => Task, (task) => task.tag)
  tasks: Task[];

  @OneToMany(() => Congrats, (congrats) => congrats.tag)
  congrats: Congrats[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
