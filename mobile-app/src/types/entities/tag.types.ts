import type { Task } from './task.types';
import type { Icon } from '../enums';

export interface Tag {
  id: number;
  label: string;
  color: string;
  icon?: Icon;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}
