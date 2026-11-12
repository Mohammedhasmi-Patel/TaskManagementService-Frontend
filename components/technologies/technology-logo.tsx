/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Cpu } from "lucide-react";
import { cn } from "cn";

interface TechnologyLogoProps {
    src: string | null;
    name: string;
    className?: string;
}

export function TechnologyLogo({ src, name, className }: TechnologyLogoProps) {
    const [hasError, setHasError] = useState(false);

    return (
        <div
            className={cn(
                "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/40",
                className
            )}
        >
            {src && !hasError ? (
                <img
                    src={src}
                    alt={`${name} logo`}
                    className="size-full object-cover"
                    onError={() => setHasError(true)}
                />
            ) : (
                <Cpu className="size-4 text-muted-foreground" />
            )}
        </div>
    );
}

