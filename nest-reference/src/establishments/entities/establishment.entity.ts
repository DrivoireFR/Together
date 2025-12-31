import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { IsIn, IsNotEmpty, IsOptional, IsBoolean, IsNumber, Min, Max } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { PlaceDetailResponseDto } from "../dto/search-establishment.dto";

export enum EstablishmentType {
    PLACE = 'PLACE',
    EVENT = 'EVENT'
}

export enum OfferType {
    STANDARD = 'STANDARD',
    PREMIUM = 'PREMIUM'
}

@Entity()
export class Establishment {
    @Column({ primary: true })
    @IsNotEmpty()
    id: string;

    @Column()
    @IsNotEmpty()
    name: string;

    @Column({
        type: "text",
        default: EstablishmentType.PLACE
    })
    @IsIn(Object.values(EstablishmentType))
    type: EstablishmentType;

    @Column()
    @IsNotEmpty()
    formattedAddress: string;

    @Column({ type: 'json', nullable: true })
    @IsOptional()
    places_data: PlaceDetailResponseDto;

    @Column({ default: false })
    @IsBoolean()
    is_partner: boolean;

    @Column({
        type: "text",
        default: OfferType.STANDARD
    })
    @IsIn(Object.values(OfferType))
    offer: OfferType;

    @Column({ nullable: true })
    @IsOptional()
    owner_account_id: number;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'owner_account_id' })
    @IsOptional()
    owner: User;

    @Column({ default: true })
    @IsBoolean()
    is_active: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
