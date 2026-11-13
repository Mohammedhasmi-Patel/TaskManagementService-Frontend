"use client";

import { Calendar } from "lucide-react";
import { cn } from "cn";
import { Input } from "@/components/ui/input";
import {
    DATE_FILTER_PRESETS,
    type DateFilterPreset,
} from "@/utils/date-range";

interface DateFilterBarProps {
    preset: DateFilterPreset;
    customFrom: string;
    customTo: string;
    onPresetChange: (preset: DateFilterPreset) => void;
    onCustomFromChange: (value: string) => void;
    onCustomToChange: (value: string) => void;
}

export function DateFilterBar({
    preset,
    customFrom,
    customTo,
    onPresetChange,
    onCustomFromChange,
    onCustomToChange,
}: DateFilterBarProps) {
    return (
        <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-input bg-muted/30 p-1">
                <span className="inline-flex items-center gap-1 px-2 text-xs font-medium text-muted-foreground">
                    <Calendar className="size-3.5" />
                    Date
                </span>
                {DATE_FILTER_PRESETS.map((item) => {
                    const active = preset === item.value;
                    return (
                        <button
                            key={item.value}
                            type="button"
                            onClick={() => onPresetChange(item.value)}
                            className={cn(
                                "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors",
                                active
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "text-muted-foreground hover:bg-background hover:text-foreground"
                            )}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {preset === "custom" && (
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-muted-foreground">
                            From
                        </span>
                        <Input
                            aria-label="From date"
                            type="date"
                            value={customFrom}
                            max={customTo || undefined}
                            onChange={(e) => onCustomFromChange(e.target.value)}
                            className="h-8 w-[148px] shrink-0 text-xs"
                        />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-muted-foreground">
                            To
                        </span>
                        <Input
                            aria-label="To date"
                            type="date"
                            value={customTo}
                            min={customFrom || undefined}
                            onChange={(e) => onCustomToChange(e.target.value)}
                            className="h-8 w-[148px] shrink-0 text-xs"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
