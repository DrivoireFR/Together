import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, FrequencyUnit } from './entities/task.entity';
import { Group } from '../groups/entities/group.entity';
import { Tag } from '../tags/entities/tag.entity';
import { UserTaskState } from '../user-task-states/entities/user-task-state.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UpdateTaskResponseDto } from './dto/update-task-response.dto';
import { CreateTaskResponseDto } from './dto/create-task-response.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(UserTaskState)
    private userTaskStateRepository: Repository<UserTaskState>,
  ) { }

  async create(createTaskDto: CreateTaskDto) {
    this.logger.debug(
      `Creating task "${createTaskDto.label}" in group ${createTaskDto.groupId}`,
    );

    const group = await this.groupRepository.findOne({
      where: { id: createTaskDto.groupId },
    });

    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    let tag: Tag | undefined = undefined;
    if (createTaskDto.tagId) {
      const foundTag = await this.tagRepository.findOne({
        where: { id: createTaskDto.tagId },
        relations: ['group'],
      });

      if (!foundTag) {
        throw new NotFoundException('Tag non trouvé');
      }

      if (foundTag.group.id !== createTaskDto.groupId) {
        throw new BadRequestException(
          'Le tag doit appartenir au même groupe que la tâche',
        );
      }

      tag = foundTag;
    }

    const task = new Task();
    task.label = createTaskDto.label;
    task.frequenceEstimee = createTaskDto.frequenceEstimee;
    task.uniteFrequence =
      (createTaskDto.uniteFrequence as FrequencyUnit) || FrequencyUnit.SEMAINE;
    task.group = group;
    task.tag = tag;
    task.points = createTaskDto.points || 1;

    await this.taskRepository.save(task);

    this.logger.log(
      `Task created: ${task.id} "${task.label}" in group ${group.id}`,
    );

    // Recharger la tâche avec les relations pour formater la réponse
    const createdTask = await this.taskRepository.findOne({
      where: { id: task.id },
      relations: ['group', 'tag'],
    });

    return {
      message: 'Tâche créée avec succès',
      task: this.formatTaskResponse(createdTask),
    };
  }

  async findAll(page = 1, limit = 50) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 100);

    const [tasks, total] = await this.taskRepository.findAndCount({
      relations: ['group', 'tag'], // REMOVE 'actions' to prevent N+1 explosion
      skip: (safePage - 1) * safeLimit,
      take: safeLimit,
      order: { createdAt: 'DESC' },
    });

    return {
      message: 'Tâches récupérées avec succès',
      tasks,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  private getFirstOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }

  private formatTaskResponse(
    task: Task | null,
  ): UpdateTaskResponseDto['task'] | CreateTaskResponseDto['task'] {
    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }
    return {
      id: task.id,
      label: task.label,
      frequenceEstimee: task.frequenceEstimee,
      uniteFrequence: task.uniteFrequence,
      points: task.points,
      group: {
        id: task.group.id,
        nom: task.group.nom,
        code: task.group.code,
      },
      tag: task.tag
        ? {
          id: task.tag.id,
          label: task.tag.label,
          color: task.tag.color,
          icon: task.tag.icon,
        }
        : null,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }

  async findOne(id: number, includeActions = false, currentMonthOnly = true) {
    // Par défaut : pas d'actions (optimisation)
    if (!includeActions) {
      const task = await this.taskRepository.findOne({
        where: { id },
        relations: ['group', 'tag'],
      });

      if (!task) {
        throw new NotFoundException('Tâche non trouvée');
      }

      return {
        message: 'Tâche récupérée avec succès',
        task,
      };
    }

    // Si actions demandées
    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.group', 'group')
      .leftJoinAndSelect('task.tag', 'tag')
      .where('task.id = :id', { id });

    if (currentMonthOnly) {
      queryBuilder.leftJoinAndSelect(
        'task.actions',
        'actions',
        'actions.date >= :firstOfMonth',
        { firstOfMonth: this.getFirstOfMonth() },
      );
    } else {
      queryBuilder.leftJoinAndSelect('task.actions', 'actions');
      this.logger.warn(
        `Loading FULL HISTORY of actions for task ${id} - may impact performance`,
      );
    }

    const task = await queryBuilder.getOne();

    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    return {
      message: 'Tâche récupérée avec succès',
      task,
    };
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['group', 'tag'],
    });

    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    let tag: Tag | undefined = undefined;
    if (updateTaskDto.tagId) {
      // On charge le group uniquement pour la validation, pas pour la réponse
      const foundTag = await this.tagRepository.findOne({
        where: { id: updateTaskDto.tagId },
        relations: ['group'],
      });

      if (!foundTag) {
        throw new NotFoundException('Tag non trouvé');
      }

      if (foundTag.group.id !== task.group.id) {
        throw new BadRequestException(
          'Le tag doit appartenir au même groupe que la tâche',
        );
      }

      tag = foundTag;
    }

    if (updateTaskDto.label) task.label = updateTaskDto.label;
    if (updateTaskDto.frequenceEstimee)
      task.frequenceEstimee = updateTaskDto.frequenceEstimee;
    if (updateTaskDto.uniteFrequence)
      task.uniteFrequence = updateTaskDto.uniteFrequence as FrequencyUnit;
    if (updateTaskDto.tagId !== undefined) task.tag = tag;
    if (updateTaskDto.points !== undefined) task.points = updateTaskDto.points;

    await this.taskRepository.save(task);

    // Recharger la tâche avec les relations pour formater la réponse
    const updatedTask = await this.taskRepository.findOne({
      where: { id: task.id },
      relations: ['group', 'tag'],
    });

    return {
      message: 'Tâche mise à jour avec succès',
      task: this.formatTaskResponse(updatedTask),
    };
  }

  async remove(id: number) {
    const queryRunner =
      this.taskRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const task = await queryRunner.manager.findOne(Task, {
        where: { id },
        relations: ['actions', 'userStates'],
      });

      if (!task) {
        throw new NotFoundException('Tâche non trouvée');
      }

      // Supprimer les userStates associés
      if (task.userStates && task.userStates.length > 0) {
        await queryRunner.manager.remove(task.userStates);
      }

      // Supprimer la tâche (les actions sont supprimées en cascade)
      await queryRunner.manager.remove(task);

      await queryRunner.commitTransaction();

      this.logger.log(`Task removed: ${id} "${task.label}"`);

      return {
        message: 'Tâche supprimée avec succès',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
