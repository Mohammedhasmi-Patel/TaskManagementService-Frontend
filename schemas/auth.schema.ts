import { z } from "zod";

export const PASSWORD_RULES = [
    {
        id: "minLength",
        label: "At least 8 characters",
        message: "Password must contain at least 8 characters.",
        test: (value: string) => value.length >= 8,
    },
    {
        id: "uppercase",
        label: "One uppercase letter",
        message: "Password must contain at least one uppercase letter.",
        test: (value: string) => /\p{Lu}/u.test(value),
    },
    {
        id: "lowercase",
        label: "One lowercase letter",
        message: "Password must contain at least one lowercase letter.",
        test: (value: string) => /\p{Ll}/u.test(value),
    },
    {
        id: "digit",
        label: "One digit",
        message: "Password must contain at least one digit.",
        test: (value: string) => /\p{Nd}/u.test(value),
    },
    {
        id: "special",
        label: "One special character",
        message: "Password must contain at least one special character.",
        test: (value: string) => /[^\p{L}\p{N}]/u.test(value),
    },
] as const;

let passwordSchema = z.string().min(1, "Password is required.");
for (const rule of PASSWORD_RULES) {
    passwordSchema = passwordSchema.refine(rule.test, { message: rule.message });
}

export const registerSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required.")
        .max(100, "First name must not exceed 100 characters."),
    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required.")
        .max(100, "Last name must not exceed 100 characters."),
    email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .max(256, "Email must not exceed 256 characters.")
        .pipe(z.email("A valid email address is required.")),
    password: passwordSchema,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .pipe(z.email("A valid email address is required.")),
    password: z.string().min(1, "Password is required."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

