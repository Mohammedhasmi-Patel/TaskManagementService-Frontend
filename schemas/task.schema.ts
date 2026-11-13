import { z } from "zod";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/types/task";

export const taskSchema = z.object({
    projectId: z.string().min(1, "Project is required."),
    title: z
        .string()
        .trim()
        .min(1, "Title is required.")
        .max(200, "Title must not exceed 200 characters."),
    description: z
        .string()
        .max(2000, "Description must not exceed 2000 characters.")
        .optional()
        .or(z.literal("")),
    status: z.enum(TASK_STATUSES, { message: "Invalid task status." }),
    priority: z.enum(TASK_PRIORITIES, { message: "Invalid task priority." }),
    estimatedHours: z
        .string()
        .trim()
        .refine(
            (val) => {
                if (val === "") return true;
                const parsed = Number(val);
                return !Number.isNaN(parsed) && parsed >= 0;
            },
            "Estimated hours cannot be negative."
        )
        .optional()
        .or(z.literal("")),
    technologyIds: z.array(z.string()),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

