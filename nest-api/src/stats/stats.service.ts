import {
  Injectable,
  Logger,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';
import { Action } from '../actions/entities/action.entity';
import { User } from '../users/entities/user.entity';
import { frequencyToMonthly } from '../common/helpers/stats.helper';
import { calculateTaskHurryState } from '../common/helpers/hurry-calculation.helper';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Action)
    private actionRepository: Repository<Action>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getPersonalOverview(groupId: number, userId: number) {
    const startTime = Date.now();
    this.logger.debug(`Getting personal overview for user ${userId} in group ${groupId}`);

    if (!groupId) throw new BadRequestException('Group ID is required');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    if (user.groupId !== groupId) {
      throw new ForbiddenException('Vous devez être membre du groupe');
    }

    const tasks = await this.taskRepository.find({
      where: { group: { id: groupId } },
      select: ['id', 'label', 'frequenceEstimee', 'uniteFrequence', 'points'],
    });

    const totalTasksVolume = tasks.reduce((sum, task) => {
      return sum + frequencyToMonthly(task.frequenceEstimee, task.uniteFrequence) * task.points;
    }, 0);

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const myActions = await this.actionRepository
      .createQueryBuilder('action')
      .leftJoinAndSelect('action.task', 'task')
      .leftJoinAndSelect('task.tag', 'tag')
      .where('action.userId = :userId', { userId })
      .andWhere('action.groupId = :groupId', { groupId })
      .andWhere('action.date >= :firstOfMonth', { firstOfMonth })
      .orderBy('action.date', 'DESC')
      .getMany();

    const myPointsDone = myActions.reduce((acc, action) => {
      return acc + (action.task?.points || 0);
    }, 0);

    const actionCountByTask = new Map<number, number>();
    for (const action of myActions) {
      const taskId = action.task?.id;
      if (taskId) {
        actionCountByTask.set(taskId, (actionCountByTask.get(taskId) || 0) + 1);
      }
    }

    const tasksWithStatus = tasks.map((task) => {
      const actualActions = actionCountByTask.get(task.id) || 0;
      const hurry = calculateTaskHurryState(
        task.id,
        task.frequenceEstimee,
        task.uniteFrequence,
        actualActions,
        now,
      );
      return {
        id: task.id,
        label: task.label,
        points: task.points,
        frequenceEstimee: task.frequenceEstimee,
        uniteFrequence: task.uniteFrequence,
        status: hurry.hurryState,
        expectedActionsAtDate: hurry.expectedActionsAtDate,
        actualActionsThisMonth: hurry.actualActionsThisMonth,
        actionsLate: hurry.actionsLate,
      };
    });

    const duration = Date.now() - startTime;
    this.logger.log(
      `Personal overview for user ${userId} in group ${groupId}: ${tasks.length} tasks, ${myActions.length} actions in ${duration}ms`,
    );

    return {
      message: 'Résumé personnel récupéré avec succès',
      overview: {
        totalTasksVolume,
        myPointsDone,
        progressPercent: totalTasksVolume > 0
          ? Math.round((myPointsDone / totalTasksVolume) * 100)
          : 0,
        actionsThisMonth: myActions.length,
        tasks: tasksWithStatus,
      },
    };
  }
}
