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
    private starterPackService: StarterPackService,
    private hotActionsService: HotActionsService,
  ) {}

  async create(createGroupDto: CreateGroupDto, userId: number) {
    const existingGroup = await this.groupRepository.findOne({
      where: { nom: createGroupDto.nom },
    });

    if (existingGroup) {
      throw new BadRequestException('Un groupe avec ce nom existe déjà');
    }

    const group = new Group();
    group.nom = createGroupDto.nom;
    await this.groupRepository.save(group);

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      group.users = [user];
      await this.groupRepository.save(group);
    }

    const starterPack = this.starterPackService.getDefaultStarterPackData();

    return {
      message: 'Groupe créé avec succès',
      group,
      starterPack,
    };
  }

  async findAll(page = 1, limit = 20) {
    const startTime = Date.now();
    this.logger.debug(`Finding all groups - page: ${page}, limit: ${limit}`);

    // Validate and cap pagination
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 50); // Max 50 items per page
    const skip = (safePage - 1) * safeLimit;

    const [groups, total] = await this.groupRepository.findAndCount({
      relations: ['users', 'tags'],
      skip,
      take: safeLimit,
      order: { createdAt: 'DESC' },
    });

    const duration = Date.now() - startTime;
    this.logger.log(
      `Found ${groups.length}/${total} groups in ${duration}ms (page ${safePage})`,
    );

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

  async findUserGroups(userId: number, page = 1, limit = 20) {
    const startTime = Date.now();
    this.logger.debug(`Finding groups for user ${userId} - page: ${page}`);

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Validate and cap pagination
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(Math.max(1, limit), 50);
    const skip = (safePage - 1) * safeLimit;

    // Optimized query: use subquery for pagination, then load relations
    const groupIdsQuery = this.groupRepository
      .createQueryBuilder('group')
      .leftJoin('group.users', 'users')
      .where('users.id = :userId', { userId })
      .select(['group.id', 'group.createdAt'])
      .skip(skip)
      .take(safeLimit)
      .orderBy('group.createdAt', 'DESC');

    const groupIds = await groupIdsQuery.getMany();

    if (groupIds.length === 0) {
      return {
        message: "Groupes de l'utilisateur récupérés avec succès",
        groups: [],
        pagination: {
          page: safePage,
          limit: safeLimit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    // Load groups with relations
    const groups = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.tasks', 'tasks')
      .leftJoin('group.users', 'users')
      .addSelect([
        'users.id',
        'users.nom',
        'users.prenom',
        'users.pseudo',
        'users.email',
        'users.icone',
        'users.createdAt',
        'users.updatedAt',
      ])
      .leftJoinAndSelect('group.tags', 'tags')
      .whereInIds(groupIds.map((g) => g.id))
      .orderBy('group.createdAt', 'DESC')
      .getMany();

    // Get total count
    const total = await this.groupRepository
      .createQueryBuilder('group')
      .leftJoin('group.users', 'users')
      .where('users.id = :userId', { userId })
      .getCount();

    const duration = Date.now() - startTime;
    this.logger.log(
      `Found ${groups.length}/${total} groups for user ${userId} in ${duration}ms`,
    );

    if (duration > 2000) {
      this.logger.warn(
        `Slow query detected: findUserGroups took ${duration}ms for user ${userId}`,
      );
    }

    return {
      message: "Groupes de l'utilisateur récupérés avec succès",
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
    const startTime = Date.now();
    this.logger.debug(`Finding group ${id} for user ${userId}`);

    const group = await this.groupRepository.findOne({
      where: { id },
      relations: [
        'users',
        'tasks',
        'tasks.tag',
        'tasks.userStates',
        'tasks.userStates.user',
        'tags',
      ],
      select: {
        users: {
          id: true,
          nom: true,
          prenom: true,
          pseudo: true,
          email: true,
          icone: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    });

    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

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
        const userTaskState = task.userStates?.find(
          (state: any) => state.user.id === userId,
        );
        const hurryInfo = hurryStateByTask[task.id];

        return {
          ...task,
          userTaskState: userTaskState
            ? {
                id: userTaskState.id,
                isAcknowledged: userTaskState.isAcknowledged,
                isConcerned: userTaskState.isConcerned,
                acknowledgedAt: userTaskState.acknowledgedAt,
                concernedAt: userTaskState.concernedAt,
                createdAt: userTaskState.createdAt,
                updatedAt: userTaskState.updatedAt,
              }
            : null,
          hurryState: hurryInfo?.hurryState || 'nope',
          expectedActionsAtDate: hurryInfo?.expectedActionsAtDate || 0,
          actualActionsThisMonth: hurryInfo?.actualActionsThisMonth || 0,
          actionsLate: hurryInfo?.actionsLate || 0,
          userStates: undefined,
        };
      });
    }

    const hotTasks = tasksWithHurryState.filter(
      (task) => task.hurryState === 'maybe' || task.hurryState === 'yes',
    );

    const duration = Date.now() - startTime;
    this.logger.log(
      `Loaded group ${id} with ${group.tasks?.length || 0} tasks in ${duration}ms`,
    );

    if (duration > 2000) {
      this.logger.warn(
        `Slow query detected: findOne(group ${id}) took ${duration}ms`,
      );
    }

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
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    const isMember = group.users.some((user) => user.id === userId);
    if (!isMember) {
      throw new ForbiddenException(
        'Vous devez être membre du groupe pour voir les Hot Actions',
      );
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

  async searchByName(nom: string) {
    const groups = await this.groupRepository
      .createQueryBuilder('group')
      .where('group.nom LIKE :nom', { nom: `%${nom}%` })
      .leftJoinAndSelect('group.users', 'users')
      .leftJoinAndSelect('group.tasks', 'tasks')
      .leftJoinAndSelect('group.tags', 'tags')
      .getMany();

    return {
      message: 'Groupes trouvés',
      groups,
    };
  }

  async joinGroup(id: number, userId: number, code: string) {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    if (group.code !== code) {
      throw new ForbiddenException('Code invalide pour ce groupe');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const isAlreadyMember = group.users.some((u) => u.id === userId);
    if (isAlreadyMember) {
      throw new BadRequestException('Vous êtes déjà membre de ce groupe');
    }

    group.users.push(user);
    await this.groupRepository.save(group);

    return {
      message: 'Vous avez rejoint le groupe avec succès',
      group,
    };
  }

  async leaveGroup(id: number, userId: number) {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    const userIndex = group.users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw new BadRequestException('Utilisateur non membre du groupe');
    }

    group.users.splice(userIndex, 1);
    await this.groupRepository.save(group);

    return {
      message: 'Utilisateur retiré du groupe avec succès',
    };
  }

  async update(id: number, updateGroupDto: UpdateGroupDto) {
    const group = await this.groupRepository.findOne({
      where: { id },
    });

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

  async remove(id: number) {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['users', 'tasks', 'actions', 'tags'],
    });

    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    if (group.tasks && group.tasks.length > 0) {
      throw new BadRequestException(
        'Impossible de supprimer le groupe car il contient des tâches',
      );
    }

    if (group.actions && group.actions.length > 0) {
      throw new BadRequestException(
        'Impossible de supprimer le groupe car il contient des actions',
      );
    }

    if (group.tags && group.tags.length > 0) {
      throw new BadRequestException(
        'Impossible de supprimer le groupe car il contient des tags',
      );
    }

    await this.groupRepository.remove(group);

    return {
      message: 'Groupe supprimé avec succès',
    };
  }

  async addTags(id: number, userId: number, tags: any[]) {
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    const isMember = group.users.some((user) => user.id === userId);
    if (!isMember) {
      throw new ForbiddenException(
        'Vous devez être membre du groupe pour ajouter des tags',
      );
    }

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
    const group = await this.groupRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!group) {
      throw new NotFoundException('Groupe non trouvé');
    }

    const isMember = group.users.some((user) => user.id === userId);
    if (!isMember) {
      throw new ForbiddenException(
        'Vous devez être membre du groupe pour ajouter des tâches',
      );
    }

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
