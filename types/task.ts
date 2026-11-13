import type { ApiResponse } from "@/types/auth";
import type { Technology } from "@/types/technology";

export const TASK_STATUSES = [
    "Todo",
    "InProgress",
    "InReview",
    "Completed",
    "Blocked",
    "Cancelled",
] as const;

export const TASK_PRIORITIES = [
    "Low",
    "Medium",
    "High",
    "Critical",
] as const;

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface TaskTimeEntrySummary {
    description: string | null;
    startTime: string;
    endTime: string | null;
    totalTimeInSeconds: number;
}

export interface Task {
    id: string;
    projectId: string;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    estimatedHours: number | null;
    createdAt: string;
    updatedAt: string | null;
    technologies: Technology[];
    timeEntries?: TaskTimeEntrySummary[];
}

export interface TaskPayload {
    projectId: string;
    title: string;
    description?: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    estimatedHours?: number | null;
    technologyIds?: string[];
}

export type CreateTaskPayload = TaskPayload;
export type UpdateTaskPayload = TaskPayload;

export interface TaskFilters {
    projectId?: string;
    status?: string;
    priority?: string;
    fromDate?: string;
    toDate?: string;
}

export type TasksResponse = ApiResponse<Task[]>;
export type TaskResponse = ApiResponse<Task>;
export type DeleteTaskResponse = ApiResponse<object | null>;

