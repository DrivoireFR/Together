import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActionsService } from './actions.service';
import { ActionsController } from './actions.controller';
import { ActionAcknowledgmentController } from './action-acknowledgment.controller';
import { Action } from './entities/action.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../users/entities/user.entity';
import { UserTaskState } from '../user-task-states/entities/user-task-state.entity';
import { ActionAcknowledgment } from './entities/action-acknowledgment.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Action, Task, User, UserTaskState, ActionAcknowledgment]),
    JwtModule,
  ],
  controllers: [ActionsController, ActionAcknowledgmentController],
  providers: [ActionsService],
  exports: [ActionsService],
})
export class ActionsModule { }
