import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Index,
} from 'typeorm';
import { Action } from './action.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@Index(['requestedFor', 'status']) // Index pour les requêtes par utilisateur et statut
@Index(['action']) // Index pour les requêtes par action
export class ActionAcknowledgment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Action, { onDelete: 'CASCADE' })
    action: Action;

    @ManyToOne(() => User)
    requestedBy: User; // Qui a créé l'action

    @ManyToOne(() => User)
    requestedFor: User; // Pour qui l'action a été créée

    @Column({
        type: 'simple-enum',
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    })
    status: 'pending' | 'accepted' | 'rejected';

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
