import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async findAll(page = 1, limit = 50) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);

    const [users, total] = await this.usersRepository.findAndCount({
      select: [
        'id',
        'nom',
        'prenom',
        'pseudo',
        'email',
        'avatar',
        'createdAt',
        'updatedAt',
      ],
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
      order: { createdAt: 'DESC' },
    });

    return {
      users,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: [
        'id',
        'nom',
        'prenom',
        'pseudo',
        'email',
        'avatar',
        'createdAt',
        'updatedAt',
      ],
    });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    return user;
  }

  async getProfile(userId: number): Promise<{ message: string; user: any }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['groups'],
      select: [
        'id',
        'nom',
        'prenom',
        'pseudo',
        'email',
        'avatar',
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

  async updateProfile(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string; user: any }> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    if (updateUserDto.nom) user.nom = updateUserDto.nom;
    if (updateUserDto.prenom) user.prenom = updateUserDto.prenom;
    if (updateUserDto.pseudo) user.pseudo = updateUserDto.pseudo;
    if (updateUserDto.avatar !== undefined) user.avatar = updateUserDto.avatar;

    await this.usersRepository.save(user);

    const { password: _, ...userWithoutPassword } = user;

    return {
      message: 'Profil mis à jour avec succès',
      user: userWithoutPassword,
    };
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
