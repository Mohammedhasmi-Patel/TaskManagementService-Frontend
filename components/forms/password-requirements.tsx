"use client";

import { IconCheck } from "@tabler/icons-react";
import { cn } from "cn";
import { PASSWORD_RULES } from "@/schemas/auth.schema";

interface PasswordRequirementsProps {
    password: string;
    id?: string;
}

export function PasswordRequirements({
    password,
    id = "password-requirements",
}: PasswordRequirementsProps) {
    return (
        <ul id={id} className="grid grid-cols-1 gap-1 pt-1 text-xs sm:grid-cols-2">
            {PASSWORD_RULES.map((rule) => {
                const passed = rule.test(password);
                return (
                    <li
                        key={rule.id}
                        className={cn(
                            "flex items-center gap-1.5 transition-colors",
                            passed
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-muted-foreground"
                        )}
                    >
                        <IconCheck
                            className={cn(
                                "size-3.5 shrink-0",
                                passed ? "opacity-100" : "opacity-35"
                            )}
                        />
                        <span>{rule.label}</span>
                    </li>
                );
            })}
        </ul>
    );
}

