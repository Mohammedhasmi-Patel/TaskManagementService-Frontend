"use client";

import { useState, type ComponentProps } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";

export function PasswordInput({
    className,
    ...props
}: Omit<ComponentProps<"input">, "type">) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                type={showPassword ? "text" : "password"}
                className={cn("pr-10", className)}
                {...props}
            />
            <button
                type="button"
                suppressHydrationWarning
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
            >
                {showPassword ? (
                    <IconEyeOff className="size-4 cursor-pointer" />
                ) : (
                    <IconEye className="size-4 cursor-pointer" />
                )}
            </button>
        </div>
    );
}

