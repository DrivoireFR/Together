import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { User } from '../users/entities/user.entity';
import { Group } from '../groups/entities/group.entity';
import { Congrats } from '../congrats/entities/congrats.entity';
import { CreateAchievementDto } from './dto/create-achievement.dto';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Congrats)
    private congratsRepository: Repository<Congrats>,
  ) {}

  async findAll() {
    return this.achievementRepository.find({
      relations: ['user', 'group', 'congrats', 'congrats.tag'],
    });
  }

  async findByUser(userId: number) {
    return this.achievementRepository.find({
      where: { user: { id: userId } },
      relations: ['group', 'congrats', 'congrats.tag'],
      order: { achievedAt: 'DESC' },
    });
  }

  async findByGroup(groupId: number) {
    return this.achievementRepository.find({
      where: { group: { id: groupId } },
      relations: ['user', 'congrats', 'congrats.tag'],
      order: { achievedAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const achievement = await this.achievementRepository.findOne({
      where: { id },
      relations: ['user', 'group', 'congrats', 'congrats.tag'],
    });

    if (!achievement) {
      throw new NotFoundException('Achievement non trouvé');
    }

    return achievement;
  }

  async create(createAchievementDto: CreateAchievementDto) {
    const user = await this.userRepository.findOne({
      where: { id: createAchievementDto.userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const group = await this.groupRepository.findOne({
      where: { id: createAchievementDto.groupId },
    });

    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    const congrats = await this.congratsRepository.findOne({
      where: { id: createAchievementDto.congratsId },
    });

    if (!congrats) {
      throw new NotFoundException('Congrats non trouvé');
    }

    const existingAchievement = await this.achievementRepository.findOne({
      where: {
        user: { id: createAchievementDto.userId },
        group: { id: createAchievementDto.groupId },
        congrats: { id: createAchievementDto.congratsId },
      },
    });

    if (existingAchievement) {
      throw new BadRequestException(
        'Achievement déjà attribué à cet utilisateur pour ce groupe',
      );
    }

    const achievement = this.achievementRepository.create({
      user,
      group,
      congrats,
      achievedAt: createAchievementDto.achievedAt
        ? new Date(createAchievementDto.achievedAt)
        : new Date(),
    });

    const savedAchievement = await this.achievementRepository.save(achievement);

    return this.achievementRepository.findOne({
      where: { id: savedAchievement.id },
      relations: ['user', 'group', 'congrats', 'congrats.tag'],
    });
  }

  async remove(id: number) {
    const result = await this.achievementRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Achievement non trouvé');
    }

    return { message: 'Achievement supprimé avec succès' };
  }

  async getStats(userId: number, groupId?: number) {
    const whereCondition: any = { user: { id: userId } };
    if (groupId) {
      whereCondition.group = { id: groupId };
    }

    const achievements = await this.achievementRepository.find({
      where: whereCondition,
      relations: ['group', 'congrats', 'congrats.tag'],
    });

    const statsByTag = achievements.reduce(
      (acc, achievement) => {
        const tagLabel = achievement.congrats.tag.label;
        if (!acc[tagLabel]) {
          acc[tagLabel] = { level1: 0, level2: 0, total: 0 };
        }
        if (achievement.congrats.level === 1) {
          acc[tagLabel].level1++;
        } else if (achievement.congrats.level === 2) {
          acc[tagLabel].level2++;
        }
        acc[tagLabel].total++;
        return acc;
      },
      {} as Record<string, { level1: number; level2: number; total: number }>,
    );

    const statsByGroup = achievements.reduce(
      (acc, achievement) => {
        const groupName = achievement.group.nom;
        if (!acc[groupName]) {
          acc[groupName] = { level1: 0, level2: 0, total: 0 };
        }
        if (achievement.congrats.level === 1) {
          acc[groupName].level1++;
        } else if (achievement.congrats.level === 2) {
          acc[groupName].level2++;
        }
        acc[groupName].total++;
        return acc;
      },
      {} as Record<string, { level1: number; level2: number; total: number }>,
    );

    return {
      totalAchievements: achievements.length,
      statsByTag,
      statsByGroup,
    };
  }
}
