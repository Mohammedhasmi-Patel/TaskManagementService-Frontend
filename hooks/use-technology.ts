"use client";

import { useCallback } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { getTechnologyById } from "@/services/technology.service";
import type { Technology } from "@/types/technology";

export function useTechnology(id: string | undefined) {
    const fetcher = useCallback(() => getTechnologyById(id!), [id]);
    const { data: technology, isLoading, errorMessage, refresh } =
        useAuthFetch<Technology | null>(
            fetcher,
            null,
            "Failed to load technology.",
            Boolean(id)
        );

    return { technology, isLoading, errorMessage, refresh };
}
