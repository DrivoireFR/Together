import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTaskStatesService } from './user-task-states.service';
import { UserTaskStatesController } from './user-task-states.controller';
import { UserTaskState } from './entities/user-task-state.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserTaskState, Task, User])],
  controllers: [UserTaskStatesController],
  providers: [UserTaskStatesService],
  exports: [UserTaskStatesService],
})
export class UserTaskStatesModule {}
