/**
 * Barrel file — maps every OpenAPI schema to a named type alias.
 * Single source of truth for all DTOs consumed by the mobile app.
 * Generated schema comes from: `npm run generate:api-types`
 */
import type { components } from './generated/schema';

// ─── Auth ────────────────────────────────────────────────────────────────────
export type RegisterDto = components['schemas']['RegisterDto'];
export type RegisterResponseDto = components['schemas']['RegisterResponseDto'];
export type RequestOtpDto = components['schemas']['RequestOtpDto'];
export type RequestOtpResponseDto = components['schemas']['RequestOtpResponseDto'];
export type VerifyOtpDto = components['schemas']['VerifyOtpDto'];
export type VerifyOtpResponseDto = components['schemas']['VerifyOtpResponseDto'];
export type UserResponseDto = components['schemas']['UserResponseDto'];

// ─── Users ───────────────────────────────────────────────────────────────────
export type UpdateUserDto = components['schemas']['UpdateUserDto'];

// ─── Groups ──────────────────────────────────────────────────────────────────
export type CreateGroupDto = components['schemas']['CreateGroupDto'];
export type JoinGroupDto = components['schemas']['JoinGroupDto'];
export type UpdateGroupDto = components['schemas']['UpdateGroupDto'];
export type StarterPackTagDto = components['schemas']['StarterPackTagDto'];
export type AddTagsDto = components['schemas']['AddTagsDto'];
export type StarterPackTaskDto = components['schemas']['StarterPackTaskDto'];
export type AddTasksDto = components['schemas']['AddTasksDto'];

// ─── Tasks ───────────────────────────────────────────────────────────────────
export type CreateTaskDto = components['schemas']['CreateTaskDto'];
export type UpdateTaskDto = components['schemas']['UpdateTaskDto'];

// ─── Actions ─────────────────────────────────────────────────────────────────
export type CreateActionDto = components['schemas']['CreateActionDto'];
export type UpdateActionDto = components['schemas']['UpdateActionDto'];
export type ActionTagDto = components['schemas']['ActionTagDto'];
export type ActionTaskDto = components['schemas']['ActionTaskDto'];
export type ActionUserDto = components['schemas']['ActionUserDto'];
export type ActionGroupDto = components['schemas']['ActionGroupDto'];
export type ActionDetailDto = components['schemas']['ActionDetailDto'];
export type CreateActionResponseDto = components['schemas']['CreateActionResponseDto'];

// ─── Tags ────────────────────────────────────────────────────────────────────
export type CreateTagDto = components['schemas']['CreateTagDto'];
export type UpdateTagDto = components['schemas']['UpdateTagDto'];

// ─── User Task States ────────────────────────────────────────────────────────
export type UpdateUserTaskStateDto = components['schemas']['UpdateUserTaskStateDto'];

// ─── Congrats ────────────────────────────────────────────────────────────────
export type CreateCongratsDto = components['schemas']['CreateCongratsDto'];
export type UpdateCongratsDto = components['schemas']['UpdateCongratsDto'];

// ─── Achievements ────────────────────────────────────────────────────────────
export type CreateAchievementDto = components['schemas']['CreateAchievementDto'];
