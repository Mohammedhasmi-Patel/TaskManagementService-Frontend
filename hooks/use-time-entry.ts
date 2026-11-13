"use client";

import { useCallback } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { getTimeEntryById } from "@/services/time-entry.service";
import type { TimeEntry } from "@/types/time-entry";

export function useTimeEntry(id: string | undefined) {
    const fetcher = useCallback(() => getTimeEntryById(id!), [id]);
    const { data: timeEntry, isLoading, errorMessage, refresh } =
        useAuthFetch<TimeEntry | null>(
            fetcher,
            null,
            "Failed to load time entry.",
            Boolean(id)
        );

    return { timeEntry, isLoading, errorMessage, refresh };
}

