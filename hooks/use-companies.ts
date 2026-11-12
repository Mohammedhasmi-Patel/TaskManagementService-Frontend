"use client";

import { useCallback } from "react";
import { useAuthFetch } from "@/hooks/use-auth-fetch";
import { getCompanies } from "@/services/company.service";
import type { Company } from "@/types/company";

const INITIAL_COMPANIES: Company[] = [];

export function useCompanies() {
    const fetcher = useCallback(() => getCompanies(), []);
    const { data: companies, isLoading, errorMessage, refresh } =
        useAuthFetch<Company[]>(
            fetcher,
            INITIAL_COMPANIES,
            "Failed to load companies."
        );

    return { companies, isLoading, errorMessage, refresh };
}
