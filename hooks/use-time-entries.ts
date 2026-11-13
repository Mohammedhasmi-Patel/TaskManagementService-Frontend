"use client";

import { useCallback } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { getTimeEntries } from "@/services/time-entry.service";
import type { TimeEntry } from "@/types/time-entry";

const INITIAL_ENTRIES: TimeEntry[] = [];

export function useTimeEntries(taskId?: string) {
    const fetcher = useCallback(
        () => getTimeEntries(taskId || undefined),
        [taskId]
    );
    const { data: timeEntries, isLoading, errorMessage, refresh } =
        useAuthFetch<TimeEntry[]>(
            fetcher,
            INITIAL_ENTRIES,
            "Failed to load time entries."
        );

    return { timeEntries, isLoading, errorMessage, refresh };
}

