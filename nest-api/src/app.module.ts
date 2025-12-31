import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

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
import { LoggerModule } from './common/logger/logger.module';

// Common
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { CircuitBreakerInterceptor } from './common/interceptors/circuit-breaker.interceptor';
import { QueryLoggerInterceptor } from './common/interceptors/query-logger.interceptor';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Rate limiting: 100 requests per minute per IP
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 10, // 10 requests per second
      },
      {
        name: 'medium',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
      {
        name: 'long',
        ttl: 3600000, // 1 hour
        limit: 1000, // 1000 requests per hour
      },
    ]),
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
      // SQLite specific timeout configuration
      extra: {
        busyTimeout: 10000, // 10 seconds timeout for SQLite
      },
    }),
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
    // Global rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Global timeout interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
    // Global circuit breaker interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: CircuitBreakerInterceptor,
    },
    // Global query logger interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: QueryLoggerInterceptor,
    },
    // Global exception filter
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
