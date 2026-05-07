import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'nom',
        'prenom',
        'pseudo',
        'email',
        'avatar',
        'groupId',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return {
      message: 'Utilisateur récupéré avec succès',
      user,
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['group'],
      select: [
        'id',
        'nom',
        'prenom',
        'pseudo',
        'email',
        'avatar',
        'emailVerified',
        'groupId',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    return {
      message: 'Profil récupéré avec succès',
      user,
    };
  }

  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (updateUserDto.nom) user.nom = updateUserDto.nom.trim();
    if (updateUserDto.prenom) user.prenom = updateUserDto.prenom.trim();
    if (updateUserDto.pseudo) user.pseudo = updateUserDto.pseudo.trim();
    if (updateUserDto.avatar !== undefined) user.avatar = updateUserDto.avatar;

    await this.usersRepository.save(user);

    const { otpCode: _, otpExpiresAt: _exp, ...userWithoutSensitive } = user;

    return {
      message: 'Profil mis à jour avec succès',
      user: userWithoutSensitive,
    };
  }

  async remove(id: number, currentUserId: number) {
    if (id !== currentUserId) {
      throw new ForbiddenException('Vous ne pouvez supprimer que votre propre compte');
    }

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    await this.usersRepository.remove(user);

    return {
      message: 'Compte supprimé avec succès',
    };
  }
}
