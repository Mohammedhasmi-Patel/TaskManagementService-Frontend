"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { TOKEN_KEY } from "@/lib/axios";
import { getCurrentUser, logoutUser } from "@/services/auth.service";

export function HomeRedirect() {
    const router = useRouter();

    useEffect(() => {
        let active = true;

        async function checkAuth() {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem(TOKEN_KEY)
                    : null;

            if (!token) {
                router.replace("/login");
                return;
            }

            try {
                const response = await getCurrentUser();
                if (!active) return;

                if (response.success && response.data) {
                    router.replace("/dashboard");
                    return;
                }
            } catch {
            }

            if (!active) return;
            logoutUser();
            router.replace("/login");
        }

        checkAuth();

        return () => {
            active = false;
        };
    }, [router]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/20">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                <span>Checking session...</span>
            </div>
        </main>
    );
}

