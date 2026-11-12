import { z } from "zod";

const MAX_LOGO_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_LOGO_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isValidHttpUrl(value: string): boolean {
    try {
        const parsed = new URL(value);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
}

function hasAllowedExtension(fileName: string): boolean {
    const dotIndex = fileName.lastIndexOf(".");
    if (dotIndex === -1) return false;
    const extension = fileName.slice(dotIndex).toLowerCase();
    return ALLOWED_LOGO_EXTENSIONS.includes(extension);
}

export const companySchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Company name is required.")
        .max(150, "Company name must not exceed 150 characters."),
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
        .max(1000, "Description must not exceed 1000 characters.")
        .optional()
        .or(z.literal("")),
    website: z
        .string()
        .trim()
        .refine(
            (url) => url === "" || isValidHttpUrl(url),
            "Please enter a valid website URL."
        )
        .optional()
        .or(z.literal("")),
    isDefault: z.boolean(),
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

export const createCompanySchema = companySchema;
export const updateCompanySchema = companySchema;

export type CompanyFormValues = z.infer<typeof companySchema>;
export type CreateCompanyFormValues = CompanyFormValues;
export type UpdateCompanyFormValues = CompanyFormValues;
