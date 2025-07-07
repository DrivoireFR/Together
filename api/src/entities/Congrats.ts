import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsNotEmpty, IsIn } from 'class-validator';
import { Tag } from './Tag';
import { Achievement } from './Achievement';

@Entity()
export class Congrats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsIn([1, 2])
  level: number;

  @Column('text')
  @IsNotEmpty()
  message: string;

  @ManyToOne(() => Tag, tag => tag.congrats)
  tag: Tag;

  @OneToMany(() => Achievement, achievement => achievement.congrats)
  achievements: Achievement[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}