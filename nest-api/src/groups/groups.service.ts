import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { User } from '../users/entities/user.entity';
import { Action } from '../actions/entities/action.entity';
import { Task } from '../tasks/entities/task.entity';
import { Tag } from '../tags/entities/tag.entity';
import { UserTaskState } from '../user-task-states/entities/user-task-state.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { StarterPackService } from './services/starter-pack.service';
import { HotActionsService } from './services/hot-actions.service';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);

  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Action)
    private actionRepository: Repository<Action>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(UserTaskState)
    private userTaskStateRepository: Repository<UserTaskState>,
    private starterPackService: StarterPackService,
    private hotActionsService: HotActionsService,
  ) {}

  private async getUserOrFail(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }

  private async assertMember(userId: number, groupId: number): Promise<User> {
    const user = await this.getUserOrFail(userId);
    if (user.groupId !== groupId) {
      throw new ForbiddenException('Vous devez être membre du groupe');
    }
    return user;
  }

  async create(createGroupDto: CreateGroupDto, userId: number) {
    const user = await this.getUserOrFail(userId);

    if (user.groupId) {
      throw new BadRequestException(
        "Vous appartenez déjà à un groupe. Quittez-le avant d'en créer un nouveau.",
      );
    }

    const existingGroup = await this.groupRepository.findOne({
      where: { nom: createGroupDto.nom },
    });
    if (existingGroup) {
      throw new BadRequestException('Un groupe avec ce nom existe déjà');
    }

    const group = new Group();
    group.nom = createGroupDto.nom;
    await this.groupRepository.save(group);

    user.groupId = group.id;
    await this.userRepository.save(user);

    const starterPack = this.starterPackService.getDefaultStarterPackData();

    this.logger.log(
      `Group created: ${group.id} "${group.nom}" by user ${userId}`,
    );

    return {
      message: 'Groupe créé avec succès',
      group,
      starterPack,
    };
  }

  async findAll(page = 1, limit = 20) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 50);
    const skip = (safePage - 1) * safeLimit;

    const [groups, total] = await this.groupRepository.findAndCount({
      relations: ['users', 'tags'],
      select: {
        users: {
          id: true,
          nom: true,
          prenom: true,
          pseudo: true,
          avatar: true,
        },
      },
      skip,
      take: safeLimit,
      order: { createdAt: 'DESC' },
    });

    return {
      message: 'Groupes récupérés avec succès',
      groups,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findOne(id: number, userId: number) {
    await this.assertMember(userId, id);

    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['users', 'tasks', 'tasks.tag', 'tags'],
      select: {
        users: {
          id: true,
          nom: true,
          prenom: true,
          pseudo: true,
          email: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    const userTaskStates = await this.userTaskStateRepository.find({
      where: {
        user: { id: userId },
        task: { group: { id } },
      },
      relations: ['task'],
    });

    const userStateByTaskId = new Map(
      userTaskStates.map((state) => [state.task.id, state]),
    );

    const tasksWithHurryState =
      await this.hotActionsService.getTasksWithHurryState(id);

    const hurryStateByTask = tasksWithHurryState.reduce(
      (acc, taskWithHurry) => {
        acc[taskWithHurry.id] = {
          hurryState: taskWithHurry.hurryState,
          expectedActionsAtDate: taskWithHurry.expectedActionsAtDate,
          actualActionsThisMonth: taskWithHurry.actualActionsThisMonth,
          actionsLate: taskWithHurry.actionsLate,
        };
        return acc;
      },
      {} as Record<number, any>,
    );

    if (group.tasks) {
      group.tasks = group.tasks.map((task: any) => {
        const userTaskState = userStateByTaskId.get(task.id);
        const hurryInfo = hurryStateByTask[task.id];

        return {
          ...task,
          userTaskState: userTaskState
            ? {
                id: userTaskState.id,
                isAcknowledged: userTaskState.isAcknowledged,
                acknowledgedAt: userTaskState.acknowledgedAt,
                createdAt: userTaskState.createdAt,
                updatedAt: userTaskState.updatedAt,
              }
            : null,
          hurryState: hurryInfo?.hurryState || 'nope',
          expectedActionsAtDate: hurryInfo?.expectedActionsAtDate || 0,
          actualActionsThisMonth: hurryInfo?.actualActionsThisMonth || 0,
          actionsLate: hurryInfo?.actionsLate || 0,
        };
      });
    }

    const hotTasks = tasksWithHurryState.filter(
      (task) => task.hurryState === 'maybe' || task.hurryState === 'yes',
    );

    return {
      message: 'Groupe récupéré avec succès',
      group,
      hotActions: {
        count: hotTasks.length,
        tasks: hotTasks,
      },
    };
  }

  async getHotActions(id: number, userId: number) {
    await this.assertMember(userId, id);

    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    const hotTasks = await this.hotActionsService.getHotTasks(id);

    return {
      message: 'Hot Actions récupérées avec succès',
      hotActions: {
        count: hotTasks.length,
        tasks: hotTasks,
      },
    };
  }

  async searchByName(nom: string, limit = 20) {
    if (!nom || nom.length < 2) {
      throw new BadRequestException(
        'La recherche doit contenir au moins 2 caractères',
      );
    }

    const safeLimit = Math.min(limit, 50);

    const groups = await this.groupRepository
      .createQueryBuilder('group')
      .where('group.nom ILIKE :nom', { nom: `%${nom}%` })
      .leftJoin('group.users', 'users')
      .addSelect(['users.id', 'users.pseudo', 'users.avatar'])
      .take(safeLimit)
      .orderBy('group.createdAt', 'DESC')
      .getMany();

    return {
      message: `${groups.length} groupe(s) trouvé(s)`,
      groups,
    };
  }

  async joinGroup(id: number, userId: number, code: string) {
    const user = await this.getUserOrFail(userId);

    if (user.groupId) {
      throw new BadRequestException(
        "Vous appartenez déjà à un groupe. Quittez-le avant d'en rejoindre un autre.",
      );
    }

    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    if (group.code !== code) {
      throw new ForbiddenException('Code invalide pour ce groupe');
    }

    user.groupId = group.id;
    await this.userRepository.save(user);

    this.logger.log(`User ${userId} joined group ${id}`);

    return {
      message: 'Vous avez rejoint le groupe avec succès',
      group,
    };
  }

  async leaveGroup(id: number, userId: number) {
    await this.assertMember(userId, id);

    const user = await this.getUserOrFail(userId);
    user.groupId = undefined;
    await this.userRepository.save(user);

    this.logger.log(`User ${userId} left group ${id}`);

    return {
      message: 'Vous avez quitté le groupe avec succès',
    };
  }

  async update(id: number, updateGroupDto: UpdateGroupDto, userId: number) {
    await this.assertMember(userId, id);

    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    if (updateGroupDto.nom && updateGroupDto.nom !== group.nom) {
      const existingGroup = await this.groupRepository.findOne({
        where: { nom: updateGroupDto.nom },
      });
      if (existingGroup) {
        throw new BadRequestException('Un groupe avec ce nom existe déjà');
      }
    }

    if (updateGroupDto.nom) group.nom = updateGroupDto.nom;

    await this.groupRepository.save(group);

    return {
      message: 'Groupe mis à jour avec succès',
      group,
    };
  }

  async remove(id: number, userId: number) {
    await this.assertMember(userId, id);

    const [tasksCount, actionsCount, tagsCount] = await Promise.all([
      this.taskRepository.count({ where: { group: { id } } }),
      this.actionRepository.count({ where: { group: { id } } }),
      this.tagRepository.count({ where: { group: { id } } }),
    ]);

    if (tasksCount > 0) {
      throw new BadRequestException(
        `Impossible de supprimer: ${tasksCount} tâche(s) présente(s)`,
      );
    }
    if (actionsCount > 0) {
      throw new BadRequestException(
        `Impossible de supprimer: ${actionsCount} action(s) présente(s)`,
      );
    }
    if (tagsCount > 0) {
      throw new BadRequestException(
        `Impossible de supprimer: ${tagsCount} tag(s) présent(s)`,
      );
    }

    // Remove groupId from all members
    await this.userRepository.update({ groupId: id }, { groupId: undefined });

    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Groupe non trouvé');

    await this.groupRepository.remove(group);

    this.logger.log(`Group ${id} removed by user ${userId}`);

    return {
      message: 'Groupe supprimé avec succès',
    };
  }

  async addTags(id: number, userId: number, tags: any[]) {
    await this.assertMember(userId, id);

    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Groupe non trouvé');

    const createdTags = await this.starterPackService.addTagsToGroup(
      group,
      tags,
    );

    return {
      message: 'Tags ajoutés avec succès',
      tags: createdTags,
    };
  }

  async addTasks(id: number, userId: number, tasks: any[]) {
    await this.assertMember(userId, id);

    const group = await this.groupRepository.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Groupe non trouvé');

    const createdTasks = await this.starterPackService.addTasksToGroup(
      group,
      tasks,
    );

    return {
      message: 'Tâches ajoutées avec succès',
      tasks: createdTasks,
    };
  }
}
