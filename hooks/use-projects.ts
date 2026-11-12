"use client";

import { useCallback } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { getProjects } from "@/services/project.service";
import type { Project } from "@/types/project";

const INITIAL_PROJECTS: Project[] = [];

export function useProjects(companyId?: string) {
    const fetcher = useCallback(
        () => getProjects(companyId || undefined),
        [companyId]
    );
    const { data: projects, isLoading, errorMessage, refresh } =
        useAuthFetch<Project[]>(
            fetcher,
            INITIAL_PROJECTS,
            "Failed to load projects."
        );

    return { projects, isLoading, errorMessage, refresh };
}
