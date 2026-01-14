import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import * as bcrypt from 'bcrypt';
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

  @Column()
  @MinLength(6)
  password: string;

  @Column({ type: 'simple-enum', enum: Avatar, nullable: true })
  avatar?: Avatar;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  emailConfirmationToken?: string;

  @Column({ type: 'datetime', nullable: true })
  emailConfirmationExpiresAt?: Date;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ type: 'datetime', nullable: true })
  passwordResetExpiresAt?: Date;

  @ManyToMany(() => Group, (group) => group.users)
  groups: Group[];

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

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
