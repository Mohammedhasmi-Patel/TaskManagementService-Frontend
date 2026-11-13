"use client";

import { useCallback } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { getTaskById } from "@/services/task.service";
import type { Task } from "@/types/task";

export function useTask(id: string | undefined) {
    const fetcher = useCallback(() => getTaskById(id!), [id]);
    const { data: task, isLoading, errorMessage, refresh } =
        useAuthFetch<Task | null>(
            fetcher,
            null,
            "Failed to load task.",
            Boolean(id)
        );

    return { task, isLoading, errorMessage, refresh };
}

