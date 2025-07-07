import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Group } from '../entities/Group';
import { Task } from '../entities/Task';
import { Action } from '../entities/Action';
import { Tag } from '../entities/Tag';
import { UserTaskState } from '../entities/UserTaskState';
import { TaskBundle } from '../entities/TaskBundle';
import * as path from 'path';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_PATH || './database.sqlite',
  synchronize: true, // En production, utiliser des migrations
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Group, Task, Action, Tag, UserTaskState, TaskBundle],
  migrations: [path.join(__dirname, '../migrations/**/*{.ts,.js}')],
  subscribers: [path.join(__dirname, '../subscribers/**/*{.ts,.js}')],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Base de données initialisée avec succès');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
};