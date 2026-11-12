import type { ApiResponse } from "@/types/auth";
import type { Technology } from "@/types/technology";

export const PROJECT_STATUSES = [
    "Planned",
    "InProgress",
    "OnHold",
    "Completed",
    "Cancelled",
] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface Project {
    id: string;
    companyId: string;
    name: string;
    slug: string;
    description: string | null;
    status: string;
    startDate: string | null;
    endDate: string | null;
    isActive: boolean;
    technologies: Technology[];
}

export interface CreateProjectPayload {
    companyId: string;
    name: string;
    slug: string;
    description?: string | null;
    status: ProjectStatus;
    startDate?: string | null;
    endDate?: string | null;
    technologyIds?: string[];
}

export interface UpdateProjectPayload extends CreateProjectPayload {
    isActive: boolean;
}

export type ProjectsResponse = ApiResponse<Project[]>;
export type ProjectResponse = ApiResponse<Project>;
export type DeleteProjectResponse = ApiResponse<object | null>;
