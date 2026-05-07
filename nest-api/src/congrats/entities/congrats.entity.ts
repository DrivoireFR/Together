import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  Index,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Tag } from '../../tags/entities/tag.entity';
import { Achievement } from '../../achievements/entities/achievement.entity';

@Entity()
@Index(['tag'])
export class Congrats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  @IsNotEmpty()
  message: string;

  @ManyToOne(() => Tag, (tag) => tag.congrats, { nullable: true })
  tag?: Tag;

  @OneToMany(() => Achievement, (achievement) => achievement.congrats)
  achievements: Achievement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
