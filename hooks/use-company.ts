"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { TOKEN_KEY } from "@/lib/axios";
import { getErrorMessage, notify } from "@/lib/toast";
import { logoutUser } from "@/services/auth.service";
import { getCompanyById } from "@/services/company.service";
import type { Company } from "@/types/company";

export function useCompany(id: string | undefined) {
    const router = useRouter();
    const [company, setCompany] = useState<Company | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (!id) return;

        let active = true;
        const token =
            typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
        if (!token) {
            router.replace("/login");
            return;
        }

        getCompanyById(id)
            .then((response) => {
                if (!active) return;
                if (!response.success) {
                    const message = response.message || "Failed to load company.";
                    setErrorMessage(message);
                    notify.error(message);
                    return;
                }
                setErrorMessage(null);
                setCompany(response.data);
            })
            .catch((error: unknown) => {
                if (!active) return;
                if (isAxiosError(error) && error.response?.status === 401) {
                    logoutUser();
                    notify.error("Session expired. Please sign in again.");
                    router.replace("/login");
                    return;
                }
                const message = getErrorMessage(error, "Failed to load company.");
                setErrorMessage(message);
                notify.error(message);
            })
            .finally(() => {
                if (active) {
                    setIsLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [id, refreshKey, router]);

    const refresh = useCallback(() => {
        setIsLoading(true);
        setErrorMessage(null);
        setRefreshKey((prev) => prev + 1);
    }, []);

    return { company, isLoading, errorMessage, refresh };
}

