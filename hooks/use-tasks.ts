"use client";

import { useCallback } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { getTasks } from "@/services/task.service";
import type { Task, TaskFilters } from "@/types/task";

const INITIAL_TASKS: Task[] = [];

export function useTasks(filters?: TaskFilters) {
    const projectId = filters?.projectId;
    const status = filters?.status;
    const priority = filters?.priority;
    const fromDate = filters?.fromDate;
    const toDate = filters?.toDate;

    const fetcher = useCallback(
        () => getTasks({ projectId, status, priority, fromDate, toDate }),
        [projectId, status, priority, fromDate, toDate]
    );

    const { data: tasks, isLoading, errorMessage, refresh } =
        useAuthFetch<Task[]>(fetcher, INITIAL_TASKS, "Failed to load tasks.");

    return { tasks, isLoading, errorMessage, refresh };
}

