import { z } from "zod";

export function createTimeEntrySchema(isEdit: boolean) {
    return z
        .object({
            taskId: z.string().min(1, "Task is required."),
            startTime: z.string().optional().or(z.literal("")),
            endTime: z.string().optional().or(z.literal("")),
            durationSeconds: z
                .string()
                .trim()
                .refine((val) => {
                    if (val === "") return true;
                    const parsed = Number(val);
                    return Number.isInteger(parsed) && parsed >= 0;
                }, "Duration seconds must be a non-negative whole number.")
                .optional()
                .or(z.literal("")),
            description: z
                .string()
                .max(1000, "Description must not exceed 1000 characters.")
                .optional()
                .or(z.literal("")),
        })
        .refine(
            (values) => !isEdit || Boolean(values.startTime?.trim()),
            {
                message: "Start time is required.",
                path: ["startTime"],
            }
        )
        .refine(
            (values) => !values.endTime?.trim() || Boolean(values.startTime?.trim()),
            {
                message: "Start time is required when end time is provided.",
                path: ["startTime"],
            }
        )
        .refine(
            (values) => {
                if (!values.startTime?.trim() || !values.endTime?.trim()) return true;
                return new Date(values.endTime).getTime() >= new Date(values.startTime).getTime();
            },
            {
                message: "End time must be on or after start time.",
                path: ["endTime"],
            }
        )
        .refine(
            (values) => {
                if (!values.startTime?.trim() || values.endTime?.trim()) return true;
                return new Date(values.startTime).getTime() <= Date.now();
            },
            {
                message: "Start time cannot be in the future for a running timer.",
                path: ["startTime"],
            }
        );
}

export type TimeEntryFormValues = z.infer<ReturnType<typeof createTimeEntrySchema>>;

