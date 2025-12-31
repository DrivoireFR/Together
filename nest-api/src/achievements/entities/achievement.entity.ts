import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Congrats } from '../../congrats/entities/congrats.entity';
import { Group } from '../../groups/entities/group.entity';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.achievements)
  user: User;

  @ManyToOne(() => Group, (group) => group.achievements)
  group: Group;

  @ManyToOne(() => Congrats, (congrats) => congrats.achievements)
  congrats: Congrats;

  @Column()
  achievedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
