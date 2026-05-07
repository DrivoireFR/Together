import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserTaskState } from './entities/user-task-state.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { UpdateUserTaskStateDto } from './dto/update-user-task-state.dto';

@Injectable()
export class UserTaskStatesService {
  constructor(
    @InjectRepository(UserTaskState)
    private userTaskStateRepository: Repository<UserTaskState>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async updateTaskState(
    taskId: number,
    userId: number,
    updateDto: UpdateUserTaskStateDto,
  ) {
    const task = await this.taskRepository.findOne({ where: { id: taskId } });
    if (!task) throw new NotFoundException('Tâche non trouvée');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    let userTaskState = await this.userTaskStateRepository.findOne({
      where: { user: { id: userId }, task: { id: taskId } },
      relations: ['user', 'task'],
    });

    if (!userTaskState) {
      userTaskState = new UserTaskState();
      userTaskState.user = user;
      userTaskState.task = task;
    }

    userTaskState.isAcknowledged = updateDto.isAcknowledged;
    userTaskState.acknowledgedAt = updateDto.isAcknowledged ? new Date() : undefined;

    await this.userTaskStateRepository.save(userTaskState);

    return {
      message: 'État de la tâche mis à jour avec succès',
      userTaskState: {
        id: userTaskState.id,
        taskId: userTaskState.task.id,
        userId: userTaskState.user.id,
        isAcknowledged: userTaskState.isAcknowledged,
        acknowledgedAt: userTaskState.acknowledgedAt,
        createdAt: userTaskState.createdAt,
        updatedAt: userTaskState.updatedAt,
      },
    };
  }

  async getUserTaskStates(groupId: number, userId: number) {
    const userTaskStates = await this.userTaskStateRepository.find({
      where: {
        user: { id: userId },
        task: { group: { id: groupId } },
      },
      relations: ['user', 'task'],
    });

    return {
      message: 'États des tâches récupérés avec succès',
      userTaskStates: userTaskStates.map((state) => ({
        id: state.id,
        taskId: state.task.id,
        userId: state.user.id,
        isAcknowledged: state.isAcknowledged,
        acknowledgedAt: state.acknowledgedAt,
        createdAt: state.createdAt,
        updatedAt: state.updatedAt,
      })),
    };
  }
}
