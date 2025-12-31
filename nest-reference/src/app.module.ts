import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entities
import { User } from './users/entities/user.entity';
import { Group } from './groups/entities/group.entity';
import { Task } from './tasks/entities/task.entity';
import { Action } from './actions/entities/action.entity';
import { Tag } from './tags/entities/tag.entity';
import { UserTaskState } from './user-task-states/entities/user-task-state.entity';
import { TaskBundle } from './task-bundles/entities/task-bundle.entity';
import { Congrats } from './congrats/entities/congrats.entity';
import { Achievement } from './achievements/entities/achievement.entity';

// Modules
import { GroupsModule } from './groups/groups.module';
import { TasksModule } from './tasks/tasks.module';
import { ActionsModule } from './actions/actions.module';
import { TagsModule } from './tags/tags.module';
import { UserTaskStatesModule } from './user-task-states/user-task-states.module';
import { StatsModule } from './stats/stats.module';
import { CongratsModule } from './congrats/congrats.module';
import { AchievementsModule } from './achievements/achievements.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || './database.sqlite',
      entities: [
        User,
        Group,
        Task,
        Action,
        Tag,
        UserTaskState,
        TaskBundle,
        Congrats,
        Achievement,
      ],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    GroupsModule,
    TasksModule,
    ActionsModule,
    TagsModule,
    UserTaskStatesModule,
    StatsModule,
    CongratsModule,
    AchievementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
