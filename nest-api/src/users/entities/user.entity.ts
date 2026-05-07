import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Group } from '../../groups/entities/group.entity';
import { Action } from '../../actions/entities/action.entity';
import { UserTaskState } from '../../user-task-states/entities/user-task-state.entity';
import { Achievement } from '../../achievements/entities/achievement.entity';
import { Avatar } from '../enums/avatar.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  nom: string;

  @Column()
  @IsNotEmpty()
  prenom: string;

  @Column({ unique: true })
  @IsNotEmpty()
  pseudo: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'simple-enum', enum: Avatar, nullable: true })
  avatar?: Avatar;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  otpCode?: string;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiresAt?: Date;

  @ManyToOne(() => Group, (group) => group.users, { nullable: true })
  @JoinColumn({ name: 'groupId' })
  group?: Group;

  @Column({ nullable: true })
  groupId?: number;

  @OneToMany(() => Action, (action) => action.user)
  actions: Action[];

  @OneToMany(() => UserTaskState, (userTaskState) => userTaskState.user)
  taskStates: UserTaskState[];

  @OneToMany(() => Achievement, (achievement) => achievement.user)
  achievements: Achievement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
