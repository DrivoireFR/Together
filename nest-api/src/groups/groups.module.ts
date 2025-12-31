import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entities/group.entity';
import { User } from '../users/entities/user.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Task } from '../tasks/entities/task.entity';
import { Action } from '../actions/entities/action.entity';
import { StarterPackService } from './services/starter-pack.service';
import { HotActionsService } from './services/hot-actions.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Group, User, Tag, Task, Action]),
    JwtModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService, StarterPackService, HotActionsService],
  exports: [GroupsService, StarterPackService, HotActionsService],
})
export class GroupsModule {}
