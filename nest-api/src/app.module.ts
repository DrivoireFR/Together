import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { User } from './users/entities/user.entity';
import { Group } from './groups/entities/group.entity';
import { Task } from './tasks/entities/task.entity';
import { Action } from './actions/entities/action.entity';
import { Tag } from './tags/entities/tag.entity';
import { UserTaskState } from './user-task-states/entities/user-task-state.entity';
import { TaskBundle } from './task-bundles/entities/task-bundle.entity';
import { Congrats } from './congrats/entities/congrats.entity';
import { Achievement } from './achievements/entities/achievement.entity';

import { GroupsModule } from './groups/groups.module';
import { TasksModule } from './tasks/tasks.module';
import { ActionsModule } from './actions/actions.module';
import { TagsModule } from './tags/tags.module';
import { UserTaskStatesModule } from './user-task-states/user-task-states.module';
import { StatsModule } from './stats/stats.module';
import { CongratsModule } from './congrats/congrats.module';
import { AchievementsModule } from './achievements/achievements.module';
import { LoggerModule } from './common/logger/logger.module';

import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { CircuitBreakerInterceptor } from './common/interceptors/circuit-breaker.interceptor';
import { QueryLoggerInterceptor } from './common/interceptors/query-logger.interceptor';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

function buildTypeOrmOptions() {
  const entities = [
    User,
    Group,
    Task,
    Action,
    Tag,
    UserTaskState,
    TaskBundle,
    Congrats,
    Achievement,
  ];
  const synchronize = true;
  const databaseUrl = process.env.DATABASE_URL;
  if (databaseUrl) {
    return {
      type: 'postgres' as const,
      url: databaseUrl,
      entities,
      synchronize,
    };
  }
  return {
    type: 'postgres' as const,
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432', 10),
    username: process.env.PGUSER || 'together',
    password: process.env.PGPASSWORD || 'together',
    database: process.env.PGDATABASE || 'together',
    entities,
    synchronize,
  };
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 3600000,
        limit: 1000,
      },
    ]),
    TypeOrmModule.forRoot(buildTypeOrmOptions()),
    LoggerModule,
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
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CircuitBreakerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: QueryLoggerInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
