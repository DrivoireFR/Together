import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';
import { Task, FrequencyUnit } from '../../tasks/entities/task.entity';
import { Group } from '../entities/group.entity';
import * as starterPackData from '../../data/starter-packs.json';

export interface StarterPackTag {
  label: string;
  color: string;
}

export interface StarterPackTask {
  label: string;
  iconUrl?: string;
  frequenceEstimee: number;
  uniteFrequence: string;
  points: number;
  tagLabel: string;
}

export interface StarterPack {
  tags: Tag[];
  tasks: Task[];
}

@Injectable()
export class StarterPackService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  getDefaultStarterPackData() {
    return (starterPackData as any).defaultStarterPack;
  }

  async createTagsForGroup(
    group: Group,
    tagData: StarterPackTag[],
  ): Promise<Tag[]> {
    const createdTags: Tag[] = [];

    for (const tagInfo of tagData) {
      const tag = new Tag();
      tag.label = tagInfo.label;
      tag.color = tagInfo.color;
      tag.group = group;
      tag.isDefault = true;

      const savedTag = await this.tagRepository.save(tag);
      createdTags.push(savedTag);
    }

    return createdTags;
  }

  async createTasksForGroup(
    group: Group,
    taskData: StarterPackTask[],
    tags: Tag[],
  ): Promise<Task[]> {
    const createdTasks: Task[] = [];
    const tagMap = new Map<string, Tag>();
    tags.forEach((tag) => tagMap.set(tag.label, tag));

    for (const taskInfo of taskData) {
      const task = new Task();
      task.label = taskInfo.label;
      task.iconUrl = taskInfo.iconUrl || undefined;
      task.frequenceEstimee = taskInfo.frequenceEstimee;
      task.uniteFrequence = taskInfo.uniteFrequence as FrequencyUnit;
      task.points = taskInfo.points;
      task.group = group;

      const correspondingTag = tagMap.get(taskInfo.tagLabel);
      if (correspondingTag) {
        task.tag = correspondingTag;
      }

      const savedTask = await this.taskRepository.save(task);
      createdTasks.push(savedTask);
    }

    return createdTasks;
  }

  async createStarterPackForGroup(group: Group): Promise<StarterPack> {
    const data = this.getDefaultStarterPackData();
    const tags = await this.createTagsForGroup(group, data.tags);
    const tasks = await this.createTasksForGroup(group, data.tasks, tags);

    return { tags, tasks };
  }

  async addTagsToGroup(
    group: Group,
    tagData: StarterPackTag[],
  ): Promise<Tag[]> {
    return this.createTagsForGroup(group, tagData);
  }

  async addTasksToGroup(
    group: Group,
    taskData: StarterPackTask[],
  ): Promise<Task[]> {
    const existingTags = await this.tagRepository.find({
      where: { group: { id: group.id } },
    });

    return this.createTasksForGroup(group, taskData, existingTags);
  }
}
