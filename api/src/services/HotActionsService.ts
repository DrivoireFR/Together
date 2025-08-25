import { AppDataSource } from '../config/database';
import { Task } from '../entities/Task';
import { Action } from '../entities/Action';
import { HurryState, TaskWithHurry } from '../types/HurryState';
import { calculateTaskHurryState } from '../helpers/hurryCalculation';

export class HotActionsService {
  /**
   * Récupère les actions du mois courant pour toutes les tâches d'un groupe
   * avec une seule requête optimisée
   */
  async getTasksWithHurryState(groupId: number): Promise<TaskWithHurry[]> {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Requête optimisée : récupérer les tâches avec le count des actions du mois
    const tasksWithActionCounts = await AppDataSource
      .getRepository(Task)
      .createQueryBuilder('task')
      .leftJoin('task.actions', 'action', 'action.date >= :firstOfMonth', { firstOfMonth })
      .addSelect('COUNT(action.id)', 'actionCount')
      .where('task.groupId = :groupId', { groupId })
      .groupBy('task.id')
      .addGroupBy('task.label')
      .addGroupBy('task.iconUrl')
      .addGroupBy('task.frequenceEstimee')
      .addGroupBy('task.uniteFrequence')
      .addGroupBy('task.points')
      .getRawAndEntities();

    // Transformer les résultats en TaskWithHurry
    const tasksWithHurry: TaskWithHurry[] = tasksWithActionCounts.entities.map((task, index) => {
      const actionCount = parseInt(tasksWithActionCounts.raw[index].actionCount) || 0;
      
      const hurryCalculation = calculateTaskHurryState(
        task.id,
        task.frequenceEstimee,
        task.uniteFrequence,
        actionCount,
        now
      );

      return {
        id: task.id,
        label: task.label,
        iconUrl: task.iconUrl,
        frequenceEstimee: task.frequenceEstimee,
        uniteFrequence: task.uniteFrequence,
        points: task.points,
        hurryState: hurryCalculation.hurryState,
        expectedActionsAtDate: hurryCalculation.expectedActionsAtDate,
        actualActionsThisMonth: hurryCalculation.actualActionsThisMonth,
        actionsLate: hurryCalculation.actionsLate
      };
    });

    return tasksWithHurry;
  }

  /**
   * Version alternative plus simple si les performances le permettent
   * Récupère les tâches et leurs actions, puis calcule en mémoire
   */
  async getTasksWithHurryStateSimple(groupId: number): Promise<TaskWithHurry[]> {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Récupérer toutes les tâches du groupe
    const tasks = await AppDataSource.getRepository(Task).find({
      where: { group: { id: groupId } }
    });

    // Récupérer toutes les actions du mois pour ce groupe
    const actionsThisMonth = await AppDataSource.getRepository(Action)
      .createQueryBuilder('action')
      .leftJoinAndSelect('action.task', 'task')
      .where('action.groupId = :groupId', { groupId })
      .andWhere('action.date >= :firstOfMonth', { firstOfMonth })
      .getMany();

    // Grouper les actions par tâche
    const actionsByTask = actionsThisMonth.reduce((acc, action) => {
      const taskId = action.task.id;
      acc[taskId] = (acc[taskId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Calculer le HurryState pour chaque tâche
    const tasksWithHurry: TaskWithHurry[] = tasks.map(task => {
      const actualActionsThisMonth = actionsByTask[task.id] || 0;
      
      const hurryCalculation = calculateTaskHurryState(
        task.id,
        task.frequenceEstimee,
        task.uniteFrequence,
        actualActionsThisMonth,
        now
      );

      return {
        id: task.id,
        label: task.label,
        iconUrl: task.iconUrl,
        frequenceEstimee: task.frequenceEstimee,
        uniteFrequence: task.uniteFrequence,
        points: task.points,
        hurryState: hurryCalculation.hurryState,
        expectedActionsAtDate: hurryCalculation.expectedActionsAtDate,
        actualActionsThisMonth: hurryCalculation.actualActionsThisMonth,
        actionsLate: hurryCalculation.actionsLate
      };
    });

    return tasksWithHurry;
  }

  /**
   * Filtre uniquement les tâches qui sont en retard (Maybe ou Yes)
   */
  async getHotTasks(groupId: number): Promise<TaskWithHurry[]> {
    const allTasks = await this.getTasksWithHurryState(groupId);
    
    return allTasks.filter(task => 
      task.hurryState === HurryState.MAYBE || task.hurryState === HurryState.YES
    );
  }
}