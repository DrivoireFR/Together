import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Congrats } from './Congrats';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.achievements)
  user: User;

  @ManyToOne(() => Congrats, congrats => congrats.achievements)
  congrats: Congrats;

  @Column()
  achievedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}