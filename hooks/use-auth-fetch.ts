"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { TOKEN_KEY } from "@/lib/axios";
import { getErrorMessage, notify } from "@/lib/toast";
import { logoutUser } from "@/services/auth.service";
import type { ApiResponse } from "@/types/auth";

export function useAuthFetch<T>(
    fetcher: () => Promise<ApiResponse<T>>,
    initialData: T,
    fallbackErrorMessage: string,
    enabled = true
) {
    const router = useRouter();
    const [data, setData] = useState<T>(initialData);
    const [isLoading, setIsLoading] = useState(enabled);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (!enabled) return;

        let active = true;

        async function load() {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem(TOKEN_KEY)
                    : null;
            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                const response = await fetcher();
                if (!active) return;

                if (!response.success) {
                    const message = response.message || fallbackErrorMessage;
                    setErrorMessage(message);
                    notify.error(message);
                    return;
                }

                setErrorMessage(null);
                setData(response.data);
            } catch (error) {
                if (!active) return;

                if (isAxiosError(error) && error.response?.status === 401) {
                    logoutUser();
                    notify.error("Session expired. Please sign in again.");
                    router.replace("/login");
                    return;
                }

                const message = getErrorMessage(error, fallbackErrorMessage);
                setErrorMessage(message);
                notify.error(message);
            } finally {
                if (active) setIsLoading(false);
            }
        }

        void load();

        return () => {
            active = false;
        };
    }, [enabled, fallbackErrorMessage, fetcher, refreshKey, router]);

    const refresh = useCallback(() => {
        setIsLoading(true);
        setErrorMessage(null);
        setRefreshKey((prev) => prev + 1);
    }, []);

    return { data, isLoading, errorMessage, refresh };
}

