import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { frequencyToMonthly } from '../common/helpers/stats.helper';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getOverview(groupId: number) {
    const startTime = Date.now();
    this.logger.debug(`Getting overview for group ${groupId}`);

    if (!groupId) {
      throw new BadRequestException('Group ID is required');
    }

    // Optimized: select only needed fields
    const tasks = await this.taskRepository.find({
      where: { group: { id: groupId } },
      select: ['id', 'label', 'frequenceEstimee', 'uniteFrequence', 'points'],
    });

    const monthlyVolume = tasks.map((task) => {
      const monthlyFrequency = frequencyToMonthly(
        task.frequenceEstimee,
        task.uniteFrequence,
      );
      return {
        taskId: task.id,
        taskLabel: task.label,
        monthlyFrequency,
        points: task.points,
        monthlyPoints: monthlyFrequency * task.points,
      };
    });

    const totalTasksVolume = monthlyVolume.reduce(
      (sum, task) => sum + task.monthlyPoints,
      0,
    );

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Optimized: select only needed user fields
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.nom',
        'user.prenom',
        'user.pseudo',
        'user.icone',
      ])
      .leftJoinAndSelect(
        'user.actions',
        'action',
        'action.groupId = :groupId AND action.date >= :firstOfMonth',
        { groupId, firstOfMonth },
      )
      .leftJoinAndSelect('action.task', 'task')
      .leftJoinAndSelect('task.tag', 'tag')
      .innerJoin('user.groups', 'group', 'group.id = :groupId', { groupId })
      .getMany();

    const allActions = users.flatMap((user) => user.actions);

    const totalDone = allActions.reduce((acc, action) => {
      return acc + (action.task?.points || 0);
    }, 0);

    const duration = Date.now() - startTime;
    this.logger.log(
      `Overview for group ${groupId}: ${tasks.length} tasks, ${users.length} users, ${allActions.length} actions in ${duration}ms`,
    );

    if (duration > 2000) {
      this.logger.warn(
        `Slow query detected: getOverview(group ${groupId}) took ${duration}ms`,
      );
    }

    return {
      message: 'Overview récupéré avec succès',
      overview: {
        totalTasksVolume,
        totalDone,
        actions: allActions,
        users,
        tasks,
      },
    };
  }
}
