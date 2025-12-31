import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Action } from './entities/action.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { UserTaskState } from '../user-task-states/entities/user-task-state.entity';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

export interface ActionsPaginationOptions {
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
  includeFullHistory?: boolean;
}

@Injectable()
export class ActionsService {
  private readonly logger = new Logger(ActionsService.name);

  constructor(
    @InjectRepository(Action)
    private actionRepository: Repository<Action>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserTaskState)
    private userTaskStateRepository: Repository<UserTaskState>,
  ) {}

  private getFirstOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  async create(createActionDto: CreateActionDto, userId: number) {
    this.logger.debug(
      `Creating action for task ${createActionDto.taskId} by user ${userId}`,
    );

    const task = await this.taskRepository.findOne({
      where: { id: createActionDto.taskId },
      relations: ['group'],
    });

    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['groups'],
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const isMemberOfGroup = user.groups.some(
      (group) => group.id === task.group.id,
    );
    if (!isMemberOfGroup) {
      throw new ForbiddenException(
        "Vous n'êtes pas membre du groupe de cette tâche",
      );
    }

    const userTaskState = await this.userTaskStateRepository.findOne({
      where: {
        user: { id: userId },
        task: { id: createActionDto.taskId },
      },
    });

    const isUserConcerned = userTaskState?.isConcerned || false;

    const action = new Action();
    action.task = task;
    action.user = user;
    action.group = task.group;
    action.date = new Date(createActionDto.date);
    action.isHelpingHand = !isUserConcerned;

    await this.actionRepository.save(action);

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const userActions = await this.actionRepository.find({
      where: {
        user: { id: userId },
        date: MoreThanOrEqual(firstOfMonth),
      },
      relations: ['task'],
    });

    const totalDone = userActions.reduce((acc, act) => {
      return acc + act.task.points;
    }, 0);

    this.logger.log(
      `Action created: user ${userId} completed task ${task.id} (${task.label}) - isHelpingHand: ${action.isHelpingHand}`,
    );

    return {
      message: 'Action créée avec succès',
      action,
      totalDone,
    };
  }

  async findAll() {
    const actions = await this.actionRepository.find({
      relations: ['task', 'user', 'group'],
    });

    return {
      message: 'Actions récupérées avec succès',
      actions,
    };
  }

  async findOne(id: number) {
    const action = await this.actionRepository.findOne({
      where: { id },
      relations: ['task', 'user', 'group'],
    });

    if (!action) {
      throw new NotFoundException('Action non trouvée');
    }

    return {
      message: 'Action récupérée avec succès',
      action,
    };
  }

  async findByUserId(userId: number) {
    const actions = await this.actionRepository.find({
      where: { user: { id: userId } },
      relations: ['task', 'user', 'group'],
    });

    return {
      message: "Actions de l'utilisateur récupérées avec succès",
      actions,
    };
  }

  async findByGroupId(groupId: number, options: ActionsPaginationOptions = {}) {
    const startTime = Date.now();
    const safePage = Math.max(1, options.page || 1);
    const safeLimit = Math.min(Math.max(1, options.limit || 50), 100);

    const queryBuilder = this.actionRepository
      .createQueryBuilder('action')
      .leftJoin('action.task', 'task')
      .addSelect(['task.id', 'task.label', 'task.points'])
      .leftJoin('action.user', 'user')
      .addSelect(['user.id', 'user.pseudo', 'user.icone'])
      .where('action.groupId = :groupId', { groupId })
      .orderBy('action.date', 'DESC')
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit);

    // Filtre mois en cours par défaut
    if (!options.includeFullHistory) {
      const startDate = options.startDate || this.getFirstOfMonth();
      const endDate = options.endDate || new Date();
      queryBuilder
        .andWhere('action.date >= :startDate', { startDate })
        .andWhere('action.date <= :endDate', { endDate });
    } else {
      this.logger.warn(
        `Loading FULL HISTORY for group ${groupId} - may impact performance`,
      );
    }

    const [actions, total] = await queryBuilder.getManyAndCount();

    const duration = Date.now() - startTime;
    this.logger.log(
      `findByGroupId(${groupId}): ${actions.length}/${total} actions in ${duration}ms`,
    );

    if (duration > 1000) {
      this.logger.warn(
        `Slow query: findByGroupId(${groupId}) took ${duration}ms`,
      );
    }

    return {
      message: 'Actions du groupe récupérées avec succès',
      actions,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findRecentByGroupId(groupId: number) {
    const actions = await this.actionRepository.find({
      where: { group: { id: groupId } },
      relations: ['task', 'user', 'group'],
      order: { createdAt: 'DESC' },
      take: 50,
    });

    return {
      message: '50 dernières actions du groupe récupérées avec succès',
      actions,
      total: actions.length,
    };
  }

  async findByTaskId(taskId: number) {
    const actions = await this.actionRepository.find({
      where: { task: { id: taskId } },
      relations: ['task', 'user', 'group'],
    });

    return {
      message: 'Actions de la tâche récupérées avec succès',
      actions,
    };
  }

  async findMyActions(userId: number) {
    const actions = await this.actionRepository.find({
      where: { user: { id: userId } },
      relations: ['task', 'user', 'group'],
    });

    return {
      message: 'Mes actions récupérées avec succès',
      actions,
    };
  }

  async update(id: number, updateActionDto: UpdateActionDto, userId: number) {
    const action = await this.actionRepository.findOne({
      where: { id },
      relations: ['task', 'user', 'group'],
    });

    if (!action) {
      throw new NotFoundException('Action non trouvée');
    }

    if (action.user.id !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que vos propres actions',
      );
    }

    if (updateActionDto.date) action.date = new Date(updateActionDto.date);

    await this.actionRepository.save(action);

    return {
      message: 'Action mise à jour avec succès',
      action,
    };
  }

  async remove(id: number, userId: number) {
    const action = await this.actionRepository.findOne({
      where: { id },
      relations: ['task', 'user', 'group'],
    });

    if (!action) {
      throw new NotFoundException('Action non trouvée');
    }

    if (action.user.id !== userId) {
      throw new ForbiddenException(
        'Vous ne pouvez supprimer que vos propres actions',
      );
    }

    await this.actionRepository.remove(action);

    return {
      message: 'Action supprimée avec succès',
    };
  }
}
