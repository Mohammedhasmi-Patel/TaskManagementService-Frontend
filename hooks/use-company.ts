"use client";

import { useCallback } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { getCompanyById } from "@/services/company.service";
import type { Company } from "@/types/company";

export function useCompany(id: string | undefined) {
    const fetcher = useCallback(() => getCompanyById(id!), [id]);
    const { data: company, isLoading, errorMessage, refresh } =
        useAuthFetch<Company | null>(
            fetcher,
            null,
            "Failed to load company.",
            Boolean(id)
        );

    return { company, isLoading, errorMessage, refresh };
}
