"use client";

import { useCallback } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { getDashboardStatistics } from "@/services/dashboard.service";
import type { DashboardStatistics } from "@/types/dashboard";

const INITIAL_STATS: DashboardStatistics = {
    totalCompanies: 0,
    totalTechnologies: 0,
    totalProjects: 0,
    totalTasks: 0,
    totalTimeEntries: 0,
};

export function useDashboardStatistics() {
    const fetcher = useCallback(() => getDashboardStatistics(), []);
    const { data: stats, isLoading, errorMessage, refresh } =
        useAuthFetch<DashboardStatistics>(
            fetcher,
            INITIAL_STATS,
            "Failed to load dashboard statistics."
        );

    return { stats, isLoading, errorMessage, refresh };
}
