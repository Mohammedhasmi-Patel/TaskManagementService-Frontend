import type { ApiResponse } from "@/types/auth";

export interface TimeEntry {
    id: string;
    taskId: string;
    startTime: string;
    endTime: string | null;
    durationSeconds: number;
    description: string | null;
    isRunning: boolean;
    createdAt: string;
    updatedAt: string | null;
}

export interface CreateTimeEntryPayload {
    taskId: string;
    startTime?: string | null;
    endTime?: string | null;
    durationSeconds?: number | null;
    description?: string | null;
}

export interface UpdateTimeEntryPayload {
    taskId: string;
    startTime: string;
    endTime?: string | null;
    durationSeconds?: number | null;
    description?: string | null;
}

export interface StopTimeEntryPayload {
    endTime?: string | null;
    description?: string | null;
}

export type TimeEntriesResponse = ApiResponse<TimeEntry[]>;
export type TimeEntryResponse = ApiResponse<TimeEntry>;
export type DeleteTimeEntryResponse = ApiResponse<object | null>;

