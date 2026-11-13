"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { logoutUser } from "@/services/auth.service";
import { createTimeEntry } from "@/services/time-entry.service";

interface StartTimerButtonProps {
    taskId: string;
    onStarted?: () => void;
    label?: string;
    size?: "sm" | "default";
    variant?: "default" | "outline" | "secondary";
    disabled?: boolean;
    title?: string;
}

export function StartTimerButton({
    taskId,
    onStarted,
    label = "Start Timer",
    size = "sm",
    variant = "secondary",
    disabled = false,
    title,
}: StartTimerButtonProps) {
    const router = useRouter();
    const [isStarting, setIsStarting] = useState(false);

    const handleStart = async () => {
        if (!taskId) return;
        setIsStarting(true);
        try {
            const response = await createTimeEntry({
                taskId,
                startTime: null,
            });
            if (!response.success) {
                notify.error(response.message || "Failed to start timer.");
                return;
            }
            notify.success("Timer started.");
            onStarted?.();
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 401) {
                logoutUser();
                notify.error("Session expired. Please sign in again.");
                router.replace("/login");
                return;
            }
            notify.error(error);
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <Button
            type="button"
            variant={variant}
            size={size}
            title={title}
            onClick={() => void handleStart()}
            disabled={disabled || isStarting || !taskId}
            className="cursor-pointer"
        >
            {isStarting ? (
                <Loader2 className="size-3.5 animate-spin" />
            ) : (
                <Play className="size-3 fill-current" />
            )}
            {label}
        </Button>
    );
}

