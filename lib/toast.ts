import { isAxiosError } from "axios";
import type { ReactElement, ReactNode } from "react";
import { toast, type ExternalToast } from "sonner";
import type { ApiErrorPayload } from "@/types/auth";

type ToastContent = (() => ReactNode) | ReactNode;
type PromiseParameters<TData> = Parameters<typeof toast.promise<TData>>[1];

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

/**
 * Extracts a human-readable message from strings, Axios responses, or Error objects.
 */
export function getErrorMessage(
    error: unknown,
    fallback = DEFAULT_ERROR_MESSAGE
): string {
    if (typeof error === "string" && error.trim()) {
        return error;
    }

    if (isAxiosError<ApiErrorPayload>(error)) {
        return error.response?.data?.message || error.message || fallback;
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
}

/**
 * Shared Sonner toast helpers covering every notification type.
 */
export const notify = {
    default: (message: ToastContent, options?: ExternalToast) =>
        toast(message, options),

    success: (message: ToastContent, options?: ExternalToast) =>
        toast.success(message, options),

    info: (message: ToastContent, options?: ExternalToast) =>
        toast.info(message, options),

    warning: (message: ToastContent, options?: ExternalToast) =>
        toast.warning(message, options),

    error: (errorOrMessage: unknown, options?: ExternalToast) => {
        if (
            typeof errorOrMessage === "string" ||
            errorOrMessage instanceof Error ||
            isAxiosError(errorOrMessage)
        ) {
            return toast.error(getErrorMessage(errorOrMessage), options);
        }

        return toast.error(
            (errorOrMessage as ToastContent) || DEFAULT_ERROR_MESSAGE,
            options
        );
    },

    loading: (message: ToastContent, options?: ExternalToast) =>
        toast.loading(message, options),

    message: (message: ToastContent, options?: ExternalToast) =>
        toast.message(message, options),

    promise: <TData>(
        promise: Promise<TData> | (() => Promise<TData>),
        options?: PromiseParameters<TData>
    ) => toast.promise(promise, options),

    custom: (
        jsx: (id: number | string) => ReactElement,
        options?: ExternalToast
    ) => toast.custom(jsx, options),

    dismiss: (id?: number | string) => toast.dismiss(id),
};

