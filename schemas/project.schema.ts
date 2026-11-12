import { z } from "zod";
import { PROJECT_STATUSES } from "@/types/project";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const projectSchema = z
    .object({
        companyId: z.string().min(1, "Company is required."),
        name: z
            .string()
            .trim()
            .min(1, "Project name is required.")
            .max(150, "Project name must not exceed 150 characters."),
        slug: z
            .string()
            .trim()
            .min(1, "Slug is required.")
            .max(180, "Slug must not exceed 180 characters.")
            .regex(
                SLUG_REGEX,
                "Slug must contain lowercase letters, numbers, and hyphens only."
            ),
        description: z
            .string()
            .max(2000, "Description must not exceed 2000 characters.")
            .optional()
            .or(z.literal("")),
        status: z.enum(PROJECT_STATUSES, {
            message: "Invalid project status.",
        }),
        startDate: z.string().optional().or(z.literal("")),
        endDate: z.string().optional().or(z.literal("")),
        isActive: z.boolean(),
        technologyIds: z.array(z.string()),
    })
    .refine(
        (values) =>
            !values.startDate ||
            !values.endDate ||
            values.endDate >= values.startDate,
        {
            message: "End date must be on or after start date.",
            path: ["endDate"],
        }
    );

export type ProjectFormValues = z.infer<typeof projectSchema>;

