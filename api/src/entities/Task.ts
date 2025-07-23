import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsNotEmpty, IsPositive, IsUrl, IsOptional } from 'class-validator';
import { Group } from './Group';
import { Tag } from './Tag';
import { Action } from './Action';
import { UserTaskState } from './UserTaskState';

export enum FrequencyUnit {
  JOUR = 'jour',
  SEMAINE = 'semaine',
  MOIS = 'mois'
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  label: string;

  @Column({ nullable: true })
  @IsUrl()
  @IsOptional()
  iconUrl?: string;

  @Column({ type: 'int' })
  @IsPositive()
  frequenceEstimee: number;

  @Column({
    type: 'simple-enum',
    enum: FrequencyUnit,
    default: FrequencyUnit.SEMAINE
  })
  uniteFrequence: FrequencyUnit;

  @Column({ type: 'int', default: 1 })
  @IsPositive()
  points: number;

  @ManyToOne(() => Group, group => group.tasks)
  group: Group;

  @ManyToOne(() => Tag, tag => tag.tasks, { nullable: true })
  tag?: Tag;

  @OneToMany(() => Action, action => action.task, { cascade: ['remove'] })
  actions: Action[];

  @OneToMany(() => UserTaskState, (userTaskState: UserTaskState) => userTaskState.task)
  userStates: UserTaskState[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}