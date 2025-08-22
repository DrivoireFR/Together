import { AppDataSource } from '../config/database';
import { Tag } from '../entities/Tag';
import { Task, FrequencyUnit } from '../entities/Task';
import { Group } from '../entities/Group';
import * as starterPackData from '../data/starter-packs.json';

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

export class StarterPackService {
  /**
   * Get the default starter pack data from JSON
   */
  getDefaultStarterPackData() {
    return starterPackData.defaultStarterPack;
  }

  /**
   * Create tags for a group from starter pack data
   */
  async createTagsForGroup(group: Group, tagData: StarterPackTag[]): Promise<Tag[]> {
    const tagRepository = AppDataSource.getRepository(Tag);
    const createdTags: Tag[] = [];

    for (const tagInfo of tagData) {
      const tag = new Tag();
      tag.label = tagInfo.label;
      tag.color = tagInfo.color;
      tag.group = group;
      tag.isDefault = true;

      const savedTag = await tagRepository.save(tag);
      createdTags.push(savedTag);
    }

    return createdTags;
  }

  /**
   * Create tasks for a group from starter pack data
   */
  async createTasksForGroup(group: Group, taskData: StarterPackTask[], tags: Tag[]): Promise<Task[]> {
    const taskRepository = AppDataSource.getRepository(Task);
    const createdTasks: Task[] = [];

    // Create a map of tag labels to tag objects for quick lookup
    const tagMap = new Map<string, Tag>();
    tags.forEach(tag => tagMap.set(tag.label, tag));

    for (const taskInfo of taskData) {
      const task = new Task();
      task.label = taskInfo.label;
      task.iconUrl = taskInfo.iconUrl || undefined;
      task.frequenceEstimee = taskInfo.frequenceEstimee;
      task.uniteFrequence = taskInfo.uniteFrequence as FrequencyUnit;
      task.points = taskInfo.points;
      task.group = group;
      
      // Find and assign the corresponding tag
      const correspondingTag = tagMap.get(taskInfo.tagLabel);
      if (correspondingTag) {
        task.tag = correspondingTag;
      }

      const savedTask = await taskRepository.save(task);
      createdTasks.push(savedTask);
    }

    return createdTasks;
  }

  /**
   * Create a complete starter pack for a group
   */
  async createStarterPackForGroup(group: Group): Promise<StarterPack> {
    const starterPackData = this.getDefaultStarterPackData();
    
    // Create tags first
    const tags = await this.createTagsForGroup(group, starterPackData.tags);
    
    // Then create tasks with tag associations
    const tasks = await this.createTasksForGroup(group, starterPackData.tasks, tags);

    return {
      tags,
      tasks
    };
  }

  /**
   * Add a list of tags to a group
   */
  async addTagsToGroup(group: Group, tagData: StarterPackTag[]): Promise<Tag[]> {
    return this.createTagsForGroup(group, tagData);
  }

  /**
   * Add a list of tasks to a group with proper tag categorization
   */
  async addTasksToGroup(group: Group, taskData: StarterPackTask[]): Promise<Task[]> {
    const tagRepository = AppDataSource.getRepository(Tag);
    
    // Get existing tags for this group
    const existingTags = await tagRepository.find({
      where: { group: { id: group.id } }
    });

    return this.createTasksForGroup(group, taskData, existingTags);
  }
}