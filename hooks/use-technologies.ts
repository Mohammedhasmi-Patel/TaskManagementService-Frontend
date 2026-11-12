"use client";

import { useCallback } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { getTechnologies } from "@/services/technology.service";
import type { Technology } from "@/types/technology";

const INITIAL_TECHNOLOGIES: Technology[] = [];

export function useTechnologies() {
    const fetcher = useCallback(() => getTechnologies(), []);
    const { data: technologies, isLoading, errorMessage, refresh } =
        useAuthFetch<Technology[]>(
            fetcher,
            INITIAL_TECHNOLOGIES,
            "Failed to load technologies."
        );

    return { technologies, isLoading, errorMessage, refresh };
}
