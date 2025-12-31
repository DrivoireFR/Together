import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { Group } from '../groups/entities/group.entity';
import { Tag } from '../tags/entities/tag.entity';
import { UserTaskState } from '../user-task-states/entities/user-task-state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Group, Tag, UserTaskState])],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
