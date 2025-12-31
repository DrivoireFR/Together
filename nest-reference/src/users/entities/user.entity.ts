import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from "typeorm";
import { IsEmail, IsIn, MinLength } from 'class-validator';
import * as bcrypt from 'bcrypt';

export enum UserType {
    ADMIN = 'ADMIN',
    OWNER = "OWNER",
    USER = "USER"
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ nullable: true })
    firstName?: string;

    @Column({ nullable: true })
    lastName?: string;

    @Column()
    @MinLength(6)
    password: string;

    @Column({
        type: "text",
        default: UserType.USER
    })
    @IsIn(Object.values(UserType))
    role: UserType

    @Column({ default: false })
    is_active: boolean;

    @Column({ default: false })
    profile_value_unlocked: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 10);
        }
    }

    async comparePassword(candidatePassword: string): Promise<boolean> {
        return bcrypt.compare(candidatePassword, this.password);
    }
}
