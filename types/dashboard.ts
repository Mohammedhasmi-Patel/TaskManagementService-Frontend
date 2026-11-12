import type { ApiResponse } from "@/types/auth";

export interface DashboardStatistics {
    totalCompanies: number;
    totalTechnologies: number;
    totalProjects: number;
    totalTasks: number;
    totalTimeEntries: number;
}

export type DashboardStatisticsResponse = ApiResponse<DashboardStatistics>;

