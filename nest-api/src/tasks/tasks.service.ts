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
  ) {}

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
    task.iconUrl = createTaskDto.iconUrl;
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

    return {
      message: 'Tâche créée avec succès',
      task,
    };
  }

  async findAll() {
    const tasks = await this.taskRepository.find({
      relations: ['group', 'tag', 'actions'],
    });

    return {
      message: 'Tâches récupérées avec succès',
      tasks,
    };
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['group', 'tag', 'actions'],
    });

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
    if (updateTaskDto.iconUrl !== undefined)
      task.iconUrl = updateTaskDto.iconUrl;
    if (updateTaskDto.frequenceEstimee)
      task.frequenceEstimee = updateTaskDto.frequenceEstimee;
    if (updateTaskDto.uniteFrequence)
      task.uniteFrequence = updateTaskDto.uniteFrequence as FrequencyUnit;
    if (updateTaskDto.tagId !== undefined) task.tag = tag;
    if (updateTaskDto.points !== undefined) task.points = updateTaskDto.points;

    await this.taskRepository.save(task);

    return {
      message: 'Tâche mise à jour avec succès',
      task,
    };
  }

  async remove(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['actions', 'userStates'],
    });

    if (!task) {
      throw new NotFoundException('Tâche non trouvée');
    }

    if (task.userStates && task.userStates.length > 0) {
      await this.userTaskStateRepository.remove(task.userStates);
    }

    await this.taskRepository.remove(task);

    return {
      message: 'Tâche supprimée avec succès',
    };
  }
}
