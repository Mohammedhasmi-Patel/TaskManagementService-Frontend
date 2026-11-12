"use client";

import { useCallback } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { getProjectById } from "@/services/project.service";
import type { Project } from "@/types/project";

export function useProject(id: string | undefined) {
    const fetcher = useCallback(() => getProjectById(id!), [id]);
    const { data: project, isLoading, errorMessage, refresh } =
        useAuthFetch<Project | null>(
            fetcher,
            null,
            "Failed to load project.",
            Boolean(id)
        );

    return { project, isLoading, errorMessage, refresh };
}
