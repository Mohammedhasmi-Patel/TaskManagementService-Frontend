"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { TOKEN_KEY } from "@/lib/axios";
import { getErrorMessage, notify } from "@/lib/toast";
import { logoutUser } from "@/services/auth.service";
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
    const router = useRouter();
    const [stats, setStats] = useState<DashboardStatistics>(INITIAL_STATS);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        let active = true;

        const token =
            typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
        if (!token) {
            router.replace("/login");
            return;
        }

        getDashboardStatistics()
            .then((response) => {
                if (!active) return;
                if (!response.success) {
                    const message =
                        response.message || "Failed to load dashboard statistics.";
                    setErrorMessage(message);
                    notify.error(message);
                    return;
                }
                setErrorMessage(null);
                setStats(response.data);
            })
            .catch((error: unknown) => {
                if (!active) return;
                if (isAxiosError(error) && error.response?.status === 401) {
                    logoutUser();
                    notify.error("Session expired. Please sign in again.");
                    router.replace("/login");
                    return;
                }
                const message = getErrorMessage(
                    error,
                    "Failed to load dashboard statistics."
                );
                setErrorMessage(message);
                notify.error(message);
            })
            .finally(() => {
                if (active) {
                    setIsLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [refreshKey, router]);

    const refresh = useCallback(() => {
        setIsLoading(true);
        setErrorMessage(null);
        setRefreshKey((prev) => prev + 1);
    }, []);

    return { stats, isLoading, errorMessage, refresh };
}

