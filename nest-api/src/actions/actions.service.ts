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
import { UserTaskState } from '../user-task-states/entities/user-task-state.entity';
import { ActionAcknowledgment } from './entities/action-acknowledgment.entity';
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
    @InjectRepository(ActionAcknowledgment)
    private actionAcknowledgmentRepository: Repository<ActionAcknowledgment>,
  ) { }

  private getFirstOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  async create(createActionDto: CreateActionDto, userId: number) {
    const targetUserId = createActionDto.userId || userId;
    const isForOtherUser = createActionDto.userId && createActionDto.userId !== userId;

    this.logger.debug(
      `Creating action for task ${createActionDto.taskId} by user ${userId}${isForOtherUser ? ` for user ${targetUserId}` : ''}`,
    );

    const task = await this.taskRepository.findOne({
      where: { id: createActionDto.taskId },
      relations: ['group'],
    });

    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    const requestingUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['groups'],
    });

    if (!requestingUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier que l'utilisateur qui crée l'action est membre du groupe
    const isRequestingUserMember = requestingUser.groups.some(
      (group) => group.id === task.group.id,
    );
    if (!isRequestingUserMember) {
      throw new ForbiddenException(
        "Vous n'êtes pas membre du groupe de cette tâche",
      );
    }

    // Si l'action est pour un autre utilisateur, vérifier que cet utilisateur est aussi membre
    let targetUser: User;
    if (isForOtherUser) {
      const foundTargetUser = await this.userRepository.findOne({
        where: { id: targetUserId },
        relations: ['groups'],
      });

      if (!foundTargetUser) {
        throw new NotFoundException('Utilisateur cible non trouvé');
      }

      const isTargetUserMember = foundTargetUser.groups.some(
        (group) => group.id === task.group.id,
      );
      if (!isTargetUserMember) {
        throw new ForbiddenException(
          "L'utilisateur cible n'est pas membre du groupe de cette tâche",
        );
      }

      targetUser = foundTargetUser;
    } else {
      targetUser = requestingUser;
    }

    // Déterminer si c'est un helping hand (basé sur l'utilisateur cible, pas le créateur)
    const userTaskState = await this.userTaskStateRepository.findOne({
      where: {
        user: { id: targetUserId },
        task: { id: createActionDto.taskId },
      },
    });

    const isUserConcerned = userTaskState?.isConcerned || false;

    const action = new Action();
    action.task = task;
    action.user = targetUser;
    action.group = task.group;
    action.date = new Date(createActionDto.date);
    action.isHelpingHand = !isUserConcerned;

    await this.actionRepository.save(action);

    // Si l'action est créée pour un autre utilisateur, créer un ActionAcknowledgment
    if (isForOtherUser) {
      const acknowledgment = new ActionAcknowledgment();
      acknowledgment.action = action;
      acknowledgment.requestedBy = requestingUser;
      acknowledgment.requestedFor = targetUser;
      acknowledgment.status = 'pending';
      await this.actionAcknowledgmentRepository.save(acknowledgment);

      this.logger.log(
        `Action created for other user: user ${userId} created action ${action.id} for user ${targetUserId} - acknowledgment ${acknowledgment.id} created`,
      );
    }

    // Calculer le total pour l'utilisateur cible
    const firstOfMonth = this.getFirstOfMonth();

    const result = await this.actionRepository
      .createQueryBuilder('action')
      .leftJoin('action.task', 'task')
      .select('SUM(task.points)', 'totalDone')
      .where('action.userId = :userId', { userId: targetUserId })
      .andWhere('action.date >= :firstOfMonth', { firstOfMonth })
      .getRawOne<{ totalDone: string | null }>();

    const totalDone = parseInt(result?.totalDone ?? '0', 10);

    this.logger.log(
      `Action created: user ${targetUserId} completed task ${task.id} (${task.label}) - isHelpingHand: ${action.isHelpingHand}`,
    );

    return {
      message: 'Action créée avec succès',
      action,
      totalDone,
    };
  }

  async findAll(page = 1, limit = 50, currentMonthOnly = true) {
    const startTime = Date.now();
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

    const duration = Date.now() - startTime;
    this.logger.log(`findAll(): ${actions.length}/${total} actions in ${duration}ms`);

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

    if (!action) {
      throw new NotFoundException('Action non trouvée');
    }

    return {
      message: 'Action récupérée avec succès',
      action,
    };
  }

  async findByUserId(userId: number, options: ActionsPaginationOptions = {}) {
    const startTime = Date.now();
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
    } else {
      this.logger.warn(
        `Loading FULL HISTORY for user ${userId} - may impact performance`,
      );
    }

    const [actions, total] = await queryBuilder.getManyAndCount();

    const duration = Date.now() - startTime;
    this.logger.log(
      `findByUserId(${userId}): ${actions.length}/${total} actions in ${duration}ms`,
    );

    return {
      message: "Actions de l'utilisateur récupérées avec succès",
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
    const startTime = Date.now();
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

  async findByTaskId(taskId: number, options: ActionsPaginationOptions = {}) {
    const startTime = Date.now();
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
    } else {
      this.logger.warn(
        `Loading FULL HISTORY for task ${taskId} - may impact performance`,
      );
    }

    const [actions, total] = await queryBuilder.getManyAndCount();

    const duration = Date.now() - startTime;
    this.logger.log(
      `findByTaskId(${taskId}): ${actions.length}/${total} actions in ${duration}ms`,
    );

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

  async findMyActions(userId: number, options: ActionsPaginationOptions = {}) {
    const startTime = Date.now();
    const safePage = Math.max(1, options.page || 1);
    const safeLimit = Math.min(Math.max(1, options.limit || 50), 100);

    const queryBuilder = this.actionRepository
      .createQueryBuilder('action')
      .leftJoin('action.task', 'task')
      .addSelect(['task.id', 'task.label', 'task.points', 'task.iconUrl'])
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
    } else {
      this.logger.warn(
        `Loading FULL HISTORY for user ${userId} (my actions) - may impact performance`,
      );
    }

    const [actions, total] = await queryBuilder.getManyAndCount();

    const duration = Date.now() - startTime;
    this.logger.log(
      `findMyActions(${userId}): ${actions.length}/${total} actions in ${duration}ms`,
    );

    return {
      message: 'Mes actions récupérées avec succès',
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

  async getPendingAcknowledgment(userId: number) {
    const acknowledgments = await this.actionAcknowledgmentRepository.find({
      where: {
        requestedFor: { id: userId },
        status: 'pending',
      },
      relations: [
        'action',
        'action.task',
        'action.user',
        'action.group',
        'requestedBy',
        'requestedFor',
      ],
      order: {
        createdAt: 'ASC',
      },
    });

    return {
      message: 'Actions en attente récupérées avec succès',
      acknowledgments,
    };
  }

  async acceptActionAcknowledgment(ackId: number, userId: number) {
    const acknowledgment = await this.actionAcknowledgmentRepository.findOne({
      where: { id: ackId },
      relations: ['action', 'requestedFor'],
    });

    if (!acknowledgment) {
      throw new NotFoundException('Acknowledgment non trouvé');
    }

    if (acknowledgment.requestedFor.id !== userId) {
      throw new ForbiddenException(
        "Vous ne pouvez accepter que les actions qui vous sont destinées",
      );
    }

    if (acknowledgment.status !== 'pending') {
      throw new ForbiddenException(
        "Cette action a déjà été traitée",
      );
    }

    acknowledgment.status = 'accepted';
    await this.actionAcknowledgmentRepository.save(acknowledgment);

    this.logger.log(
      `Action acknowledgment ${ackId} accepted by user ${userId}`,
    );

    return {
      message: 'Action acceptée avec succès',
      acknowledgment,
    };
  }

  async rejectActionAcknowledgment(ackId: number, userId: number) {
    const acknowledgment = await this.actionAcknowledgmentRepository.findOne({
      where: { id: ackId },
      relations: ['action', 'requestedFor'],
    });

    if (!acknowledgment) {
      throw new NotFoundException('Acknowledgment non trouvé');
    }

    if (acknowledgment.requestedFor.id !== userId) {
      throw new ForbiddenException(
        "Vous ne pouvez refuser que les actions qui vous sont destinées",
      );
    }

    if (acknowledgment.status !== 'pending') {
      throw new ForbiddenException(
        "Cette action a déjà été traitée",
      );
    }

    // Supprimer l'action associée
    const actionId = acknowledgment.action.id;
    await this.actionRepository.remove(acknowledgment.action);

    // Supprimer l'acknowledgment
    await this.actionAcknowledgmentRepository.remove(acknowledgment);

    this.logger.log(
      `Action acknowledgment ${ackId} rejected by user ${userId}, action ${actionId} deleted`,
    );

    return {
      message: 'Action refusée et supprimée avec succès',
    };
  }
}
