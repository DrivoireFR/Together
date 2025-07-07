import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Congrats } from './Congrats';
import { Group } from './Group';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.achievements)
  user: User;

  @ManyToOne(() => Group, group => group.achievements)
  group: Group;

  @ManyToOne(() => Congrats, congrats => congrats.achievements)
  congrats: Congrats;

  @Column()
  achievedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}