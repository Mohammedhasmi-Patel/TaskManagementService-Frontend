"use client";

import { cn } from "cn";
import type { Technology } from "@/types/technology";

interface TechnologyPickerProps {
    technologies: Technology[];
    selectedIds: string[];
    onChange: (ids: string[]) => void;
    disabled?: boolean;
}

export function TechnologyPicker({
    technologies,
    selectedIds,
    onChange,
    disabled = false,
}: TechnologyPickerProps) {
    if (technologies.length === 0) {
        return (
            <p className="text-xs text-muted-foreground">
                No technologies available yet.
            </p>
        );
    }

    const toggle = (id: string) => {
        if (selectedIds.includes(id)) {
            onChange(selectedIds.filter((item) => item !== id));
        } else {
            onChange([...selectedIds, id]);
        }
    };

    return (
        <div className="flex flex-wrap gap-2 rounded-lg border border-input p-2.5">
            {technologies.map((tech) => {
                const selected = selectedIds.includes(tech.id);
                return (
                    <button
                        key={tech.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => toggle(tech.id)}
                        className={cn(
                            "cursor-pointer rounded-md border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50",
                            selected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-muted/40 text-foreground hover:bg-muted"
                        )}
                    >
                        {tech.name}
                    </button>
                );
            })}
        </div>
    );
}

