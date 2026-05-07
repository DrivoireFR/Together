import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Action } from './entities/action.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { CreateActionResponseDto } from './dto/create-action-response.dto';

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
  ) {}

  private getFirstOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  async create(createActionDto: CreateActionDto, userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    if (!user.groupId) {
      throw new ForbiddenException(
        'Vous devez appartenir à un groupe pour déclarer une action',
      );
    }

    const task = await this.taskRepository.findOne({
      where: { id: createActionDto.taskId },
      relations: ['group', 'tag'],
    });
    if (!task) throw new NotFoundException('Tâche non trouvée');

    if (task.group.id !== user.groupId) {
      throw new ForbiddenException(
        "Vous n'êtes pas membre du groupe de cette tâche",
      );
    }

    const action = new Action();
    action.task = task;
    action.user = user;
    action.group = task.group;
    action.date = new Date(createActionDto.date);

    await this.actionRepository.save(action);

    const firstOfMonth = this.getFirstOfMonth();
    const result = await this.actionRepository
      .createQueryBuilder('action')
      .leftJoin('action.task', 'task')
      .select('SUM(task.points)', 'totalDone')
      .where('action.userId = :userId', { userId })
      .andWhere('action.date >= :firstOfMonth', { firstOfMonth })
      .getRawOne<{ totalDone: string | null }>();

    const totalDone = parseInt(result?.totalDone ?? '0', 10);

    this.logger.log(
      `Action created: user ${userId} completed task ${task.id} (${task.label})`,
    );

    const response: CreateActionResponseDto = {
      message: 'Action créée avec succès',
      action: {
        id: action.id,
        date: action.date,
        task: {
          id: task.id,
          label: task.label,
          points: task.points,
          tag: task.tag
            ? { id: task.tag.id, label: task.tag.label, color: task.tag.color }
            : null,
        },
        user: {
          id: user.id,
          pseudo: user.pseudo,
          avatar: user.avatar || null,
        },
        group: {
          id: task.group.id,
          nom: task.group.nom,
          code: task.group.code,
        },
      },
      totalDone,
    };

    return response;
  }

  async findAll(page = 1, limit = 50, currentMonthOnly = true) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);

    const queryBuilder = this.actionRepository
      .createQueryBuilder('action')
      .leftJoin('action.task', 'task')
      .addSelect(['task.id', 'task.label', 'task.points'])
      .leftJoin('action.user', 'user')
      .addSelect(['user.id', 'user.pseudo', 'user.avatar'])
      .orderBy('action.date', 'DESC')
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit);

    if (currentMonthOnly) {
      queryBuilder.andWhere('action.date >= :firstOfMonth', {
        firstOfMonth: this.getFirstOfMonth(),
      });
    }

    const [actions, total] = await queryBuilder.getManyAndCount();

    return {
      message: 'Actions récupérées avec succès',
      actions,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findOne(id: number) {
    const action = await this.actionRepository.findOne({
      where: { id },
      relations: ['task', 'user', 'group'],
    });
    if (!action) throw new NotFoundException('Action non trouvée');

    return {
      message: 'Action récupérée avec succès',
      action,
    };
  }

  async findMyActions(userId: number, options: ActionsPaginationOptions = {}) {
    return this.findByUserId(
      userId,
      options,
      'Mes actions récupérées avec succès',
    );
  }

  async findByUserId(
    userId: number,
    options: ActionsPaginationOptions = {},
    message = "Actions de l'utilisateur récupérées avec succès",
  ) {
    const safePage = Math.max(1, options.page || 1);
    const safeLimit = Math.min(Math.max(1, options.limit || 50), 100);

    const queryBuilder = this.actionRepository
      .createQueryBuilder('action')
      .leftJoin('action.task', 'task')
      .addSelect(['task.id', 'task.label', 'task.points'])
      .leftJoin('action.group', 'group')
      .addSelect(['group.id', 'group.nom'])
      .where('action.userId = :userId', { userId })
      .orderBy('action.date', 'DESC')
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit);

    if (!options.includeFullHistory) {
      const startDate = options.startDate || this.getFirstOfMonth();
      const endDate = options.endDate || new Date();
      queryBuilder
        .andWhere('action.date >= :startDate', { startDate })
        .andWhere('action.date <= :endDate', { endDate });
    }

    const [actions, total] = await queryBuilder.getManyAndCount();

    return {
      message,
      actions,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findByGroupId(groupId: number, options: ActionsPaginationOptions = {}) {
    const safePage = Math.max(1, options.page || 1);
    const safeLimit = Math.min(Math.max(1, options.limit || 50), 100);

    const queryBuilder = this.actionRepository
      .createQueryBuilder('action')
      .leftJoin('action.task', 'task')
      .addSelect(['task.id', 'task.label', 'task.points'])
      .leftJoin('action.user', 'user')
      .addSelect(['user.id', 'user.pseudo', 'user.avatar'])
      .where('action.groupId = :groupId', { groupId })
      .orderBy('action.date', 'DESC')
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit);

    if (!options.includeFullHistory) {
      const startDate = options.startDate || this.getFirstOfMonth();
      const endDate = options.endDate || new Date();
      queryBuilder
        .andWhere('action.date >= :startDate', { startDate })
        .andWhere('action.date <= :endDate', { endDate });
    }

    const [actions, total] = await queryBuilder.getManyAndCount();

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

  async findByTaskId(taskId: number, options: ActionsPaginationOptions = {}) {
    const safePage = Math.max(1, options.page || 1);
    const safeLimit = Math.min(Math.max(1, options.limit || 50), 100);

    const queryBuilder = this.actionRepository
      .createQueryBuilder('action')
      .leftJoin('action.user', 'user')
      .addSelect(['user.id', 'user.pseudo', 'user.avatar'])
      .leftJoin('action.group', 'group')
      .addSelect(['group.id', 'group.nom'])
      .where('action.taskId = :taskId', { taskId })
      .orderBy('action.date', 'DESC')
      .skip((safePage - 1) * safeLimit)
      .take(safeLimit);

    if (!options.includeFullHistory) {
      const startDate = options.startDate || this.getFirstOfMonth();
      const endDate = options.endDate || new Date();
      queryBuilder
        .andWhere('action.date >= :startDate', { startDate })
        .andWhere('action.date <= :endDate', { endDate });
    }

    const [actions, total] = await queryBuilder.getManyAndCount();

    return {
      message: 'Actions de la tâche récupérées avec succès',
      actions,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async update(id: number, updateActionDto: UpdateActionDto, userId: number) {
    const action = await this.actionRepository.findOne({
      where: { id },
      relations: ['task', 'user', 'group'],
    });
    if (!action) throw new NotFoundException('Action non trouvée');

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
      relations: ['user'],
    });
    if (!action) throw new NotFoundException('Action non trouvée');

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
