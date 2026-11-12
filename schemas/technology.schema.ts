import { z } from "zod";

const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_LOGO_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function hasAllowedExtension(fileName: string): boolean {
    const dotIndex = fileName.lastIndexOf(".");
    if (dotIndex === -1) return false;
    return ALLOWED_LOGO_EXTENSIONS.includes(fileName.slice(dotIndex).toLowerCase());
}

export const technologySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Technology name is required.")
        .max(100, "Technology name must not exceed 100 characters."),
    slug: z
        .string()
        .trim()
        .min(1, "Slug is required.")
        .max(120, "Slug must not exceed 120 characters.")
        .regex(
            SLUG_REGEX,
            "Slug must contain lowercase letters, numbers, and hyphens only."
        ),
    description: z
        .string()
        .max(1000, "Description must not exceed 1000 characters.")
        .optional()
        .or(z.literal("")),
    logo: z
        .custom<File | undefined>((value) => value === undefined || value instanceof File)
        .refine(
            (file) => !file || file.size <= MAX_LOGO_SIZE_BYTES,
            "Logo size cannot exceed 2 MB."
        )
        .refine(
            (file) => !file || hasAllowedExtension(file.name),
            "Only JPG, JPEG, PNG, and WEBP files are allowed."
        )
        .optional(),
});

export type TechnologyFormValues = z.infer<typeof technologySchema>;

