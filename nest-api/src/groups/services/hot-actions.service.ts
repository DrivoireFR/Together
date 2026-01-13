import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';
import { Action } from '../../actions/entities/action.entity';
import { HurryState, TaskWithHurry } from '../../common/types/hurry-state.type';
import { calculateTaskHurryState } from '../../common/helpers/hurry-calculation.helper';

@Injectable()
export class HotActionsService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Action)
    private actionRepository: Repository<Action>,
  ) { }

  async getTasksWithHurryState(groupId: number): Promise<TaskWithHurry[]> {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const tasksWithActionCounts = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoin('task.actions', 'action', 'action.date >= :firstOfMonth', {
        firstOfMonth,
      })
      .addSelect('COUNT(action.id)', 'actionCount')
      .where('task.groupId = :groupId', { groupId })
      .groupBy('task.id')
      .addGroupBy('task.label')
      .addGroupBy('task.frequenceEstimee')
      .addGroupBy('task.uniteFrequence')
      .addGroupBy('task.points')
      .getRawAndEntities();

    const tasksWithHurry: TaskWithHurry[] = tasksWithActionCounts.entities.map(
      (task, index) => {
        const actionCount =
          parseInt(tasksWithActionCounts.raw[index].actionCount) || 0;

        const hurryCalculation = calculateTaskHurryState(
          task.id,
          task.frequenceEstimee,
          task.uniteFrequence,
          actionCount,
          now,
        );

        return {
          id: task.id,
          label: task.label,
          frequenceEstimee: task.frequenceEstimee,
          uniteFrequence: task.uniteFrequence,
          points: task.points,
          hurryState: hurryCalculation.hurryState,
          expectedActionsAtDate: hurryCalculation.expectedActionsAtDate,
          actualActionsThisMonth: hurryCalculation.actualActionsThisMonth,
          actionsLate: hurryCalculation.actionsLate,
        };
      },
    );

    return tasksWithHurry;
  }

  async getHotTasks(groupId: number): Promise<TaskWithHurry[]> {
    const allTasks = await this.getTasksWithHurryState(groupId);

    return allTasks.filter(
      (task) =>
        task.hurryState === HurryState.MAYBE ||
        task.hurryState === HurryState.YES,
    );
  }
}
