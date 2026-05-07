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
    const achievements = await this.achievementRepository.find({
      relations: ['user', 'group', 'congrats', 'congrats.tag'],
    });
    return { message: 'Achievements récupérés avec succès', achievements };
  }

  async findByUser(userId: number) {
    const achievements = await this.achievementRepository.find({
      where: { user: { id: userId } },
      relations: ['group', 'congrats', 'congrats.tag'],
      order: { achievedAt: 'DESC' },
    });
    return { message: "Achievements de l'utilisateur récupérés", achievements };
  }

  async findByGroup(groupId: number) {
    const achievements = await this.achievementRepository.find({
      where: { group: { id: groupId } },
      relations: ['user', 'congrats', 'congrats.tag'],
      order: { achievedAt: 'DESC' },
    });
    return { message: 'Achievements du groupe récupérés', achievements };
  }

  async findOne(id: number) {
    const achievement = await this.achievementRepository.findOne({
      where: { id },
      relations: ['user', 'group', 'congrats', 'congrats.tag'],
    });
    if (!achievement) throw new NotFoundException('Achievement non trouvé');
    return { message: 'Achievement récupéré avec succès', achievement };
  }

  async create(createAchievementDto: CreateAchievementDto) {
    const user = await this.userRepository.findOne({
      where: { id: createAchievementDto.userId },
    });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    const group = await this.groupRepository.findOne({
      where: { id: createAchievementDto.groupId },
    });
    if (!group) throw new NotFoundException('Groupe non trouvé');

    const congrats = await this.congratsRepository.findOne({
      where: { id: createAchievementDto.congratsId },
    });
    if (!congrats) throw new NotFoundException('Congrats non trouvé');

    const existingAchievement = await this.achievementRepository.findOne({
      where: {
        user: { id: createAchievementDto.userId },
        group: { id: createAchievementDto.groupId },
        congrats: { id: createAchievementDto.congratsId },
      },
    });
    if (existingAchievement) {
      throw new BadRequestException('Achievement déjà attribué');
    }

    const achievement = this.achievementRepository.create({
      user,
      group,
      congrats,
      achievedAt: createAchievementDto.achievedAt
        ? new Date(createAchievementDto.achievedAt)
        : new Date(),
    });

    await this.achievementRepository.save(achievement);

    const savedAchievement = await this.achievementRepository.findOne({
      where: { id: achievement.id },
      relations: ['user', 'group', 'congrats', 'congrats.tag'],
    });

    return {
      message: 'Achievement créé avec succès',
      achievement: savedAchievement,
    };
  }

  async remove(id: number) {
    const result = await this.achievementRepository.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Achievement non trouvé');
    return { message: 'Achievement supprimé avec succès' };
  }

  async getStats(userId: number, groupId?: number) {
    const whereCondition: any = { user: { id: userId } };
    if (groupId) whereCondition.group = { id: groupId };

    const achievements = await this.achievementRepository.find({
      where: whereCondition,
      relations: ['group', 'congrats', 'congrats.tag'],
    });

    const statsByTag = achievements.reduce(
      (acc, achievement) => {
        const tagLabel = achievement.congrats?.tag?.label || 'Sans tag';
        if (!acc[tagLabel]) acc[tagLabel] = { total: 0 };
        acc[tagLabel].total++;
        return acc;
      },
      {} as Record<string, { total: number }>,
    );

    return {
      message: 'Stats des achievements récupérées',
      stats: {
        totalAchievements: achievements.length,
        statsByTag,
      },
    };
  }
}
