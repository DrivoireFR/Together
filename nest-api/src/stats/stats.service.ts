import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { frequencyToMonthly } from '../common/helpers/stats.helper';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getOverview(groupId: number) {
    if (!groupId) {
      throw new BadRequestException('Group ID is required');
    }

    const tasks = await this.taskRepository.find({
      where: { group: { id: groupId } },
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

    const users = await this.userRepository
      .createQueryBuilder('user')
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
