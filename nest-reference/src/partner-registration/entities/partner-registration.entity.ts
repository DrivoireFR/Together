import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { UserType } from "src/users/entities/user.entity";
import { IsIn } from "class-validator";

export enum PartnerRegistrationStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

@Entity()
export class PartnerRegistration {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    phone: string;

    @Column({
        type: "text",
        default: UserType.OWNER
    })
    @IsIn(Object.values(UserType))
    role: UserType;

    @Column({ type: "json" })
    establishment: any;

    @Column({
        type: "text",
        default: PartnerRegistrationStatus.PENDING
    })
    @IsIn(Object.values(PartnerRegistrationStatus))
    status: PartnerRegistrationStatus;

    @Column({ type: "text", nullable: true })
    admin_notes: string | null;

    @Column({ type: "text", nullable: true })
    rejection_reason: string | null;

    @Column({ type: "uuid", nullable: true })
    processed_by_admin_id: string | null;

    @CreateDateColumn()
    created_at: Date;

    @Column({ type: "datetime", nullable: true })
    processed_at: Date | null;

    @UpdateDateColumn()
    updated_at: Date;
}
