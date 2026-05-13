/**
 * Simple dependency injection container.
 * Wires repositories (concrete implementations) into use cases.
 */
import { authRepository } from '../repositories/authRepository';
import { groupRepository } from '../repositories/groupRepository';
import { taskRepository } from '../repositories/taskRepository';
import { actionRepository } from '../repositories/actionRepository';
import { tagRepository } from '../repositories/tagRepository';
import { statsRepository } from '../repositories/statsRepository';
import { userTaskStateRepository } from '../repositories/userTaskStateRepository';

import { RegisterUseCase, RequestOtpUseCase, VerifyOtpUseCase, GetProfileUseCase, UpdateProfileUseCase, InitializeAuthUseCase, LogoutUseCase } from '../usecases/auth';
import { CreateGroupUseCase, GetGroupUseCase, SearchGroupsUseCase, JoinGroupUseCase, LeaveGroupUseCase, UpdateGroupUseCase, AddTagsToGroupUseCase, AddTasksToGroupUseCase } from '../usecases/group';
import { CreateTaskUseCase, UpdateTaskUseCase, DeleteTaskUseCase, GetTasksUseCase } from '../usecases/task';
import { CreateActionUseCase, GetRecentActionsUseCase, DeleteActionUseCase } from '../usecases/action';
import { CreateTagUseCase, UpdateTagUseCase, DeleteTagUseCase, GetTagsByGroupUseCase } from '../usecases/tag';
import { GetOverviewUseCase } from '../usecases/stats';

// Auth
export const registerUseCase = new RegisterUseCase(authRepository);
export const requestOtpUseCase = new RequestOtpUseCase(authRepository);
export const verifyOtpUseCase = new VerifyOtpUseCase(authRepository);
export const getProfileUseCase = new GetProfileUseCase(authRepository);
export const updateProfileUseCase = new UpdateProfileUseCase(authRepository);
export const initializeAuthUseCase = new InitializeAuthUseCase(authRepository);
export const logoutUseCase = new LogoutUseCase();

// Group
export const createGroupUseCase = new CreateGroupUseCase(groupRepository);
export const getGroupUseCase = new GetGroupUseCase(groupRepository);
export const searchGroupsUseCase = new SearchGroupsUseCase(groupRepository);
export const joinGroupUseCase = new JoinGroupUseCase(groupRepository);
export const leaveGroupUseCase = new LeaveGroupUseCase(groupRepository);
export const updateGroupUseCase = new UpdateGroupUseCase(groupRepository);
export const addTagsToGroupUseCase = new AddTagsToGroupUseCase(groupRepository);
export const addTasksToGroupUseCase = new AddTasksToGroupUseCase(groupRepository);

// Task
export const createTaskUseCase = new CreateTaskUseCase(taskRepository);
export const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
export const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
export const getTasksUseCase = new GetTasksUseCase(taskRepository);

// Action
export const createActionUseCase = new CreateActionUseCase(actionRepository);
export const getRecentActionsUseCase = new GetRecentActionsUseCase(actionRepository);
export const deleteActionUseCase = new DeleteActionUseCase(actionRepository);

// Tag
export const createTagUseCase = new CreateTagUseCase(tagRepository);
export const updateTagUseCase = new UpdateTagUseCase(tagRepository);
export const deleteTagUseCase = new DeleteTagUseCase(tagRepository);
export const getTagsByGroupUseCase = new GetTagsByGroupUseCase(tagRepository);

// Stats
export const getOverviewUseCase = new GetOverviewUseCase(statsRepository);

// User Task States (exported as repository since use cases are thin wrappers)
export { userTaskStateRepository };
