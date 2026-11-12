import api from "@/lib/axios";
import type { DashboardStatisticsResponse } from "@/types/dashboard";

export async function getDashboardStatistics(): Promise<DashboardStatisticsResponse> {
    const { data } = await api.get<DashboardStatisticsResponse>("/api/dashboard/statistics");
    return data;
}

