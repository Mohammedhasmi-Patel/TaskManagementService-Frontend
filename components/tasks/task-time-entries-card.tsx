"use client";

import { Clock, History } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { TaskTimeEntrySummary } from "@/types/task";
import { formatDuration } from "@/utils/time";

interface TaskTimeEntriesCardProps {
    entries: TaskTimeEntrySummary[];
}

export function TaskTimeEntriesCard({ entries }: TaskTimeEntriesCardProps) {
    const totalSeconds = entries.reduce(
        (sum, e) => sum + (e.totalTimeInSeconds ?? 0),
        0
    );

    return (
        <Card className="border-border/80 shadow-xs">
            <CardHeader className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <History className="size-4 text-primary" />
                        Logged Time Entries
                    </CardTitle>
                    <CardDescription>
                        Detailed breakdown of all work sessions recorded for this task.
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground">
                        {entries.length} {entries.length === 1 ? "session" : "sessions"}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 font-mono text-xs font-medium text-secondary-foreground">
                        Total: {formatDuration(totalSeconds)}
                    </span>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {entries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
                        <Clock className="size-8 text-muted-foreground/40" />
                        <p className="text-sm font-medium">No time entries recorded yet.</p>
                        <p className="text-xs">
                            Start the live timer or log completed work manually to track progress.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-muted/40 text-xs font-medium text-muted-foreground">
                                <tr>
                                    <th className="px-4 py-3">Duration</th>
                                    <th className="px-4 py-3">Start Time</th>
                                    <th className="px-4 py-3">End Time</th>
                                    <th className="px-4 py-3">Description / Note</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {entries.map((entry, index) => {
                                    const isRunning = !entry.endTime;
                                    return (
                                        <tr
                                            key={`${entry.startTime}-${index}`}
                                            className="transition-colors hover:bg-muted/30"
                                        >
                                            <td className="px-4 py-3 font-medium whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {isRunning ? (
                                                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                                                            <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                                                            In progress
                                                        </span>
                                                    ) : (
                                                        <span className="font-mono">
                                                            {formatDuration(entry.totalTimeInSeconds)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                                                {new Date(entry.startTime).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                                                {entry.endTime ? (
                                                    new Date(entry.endTime).toLocaleString()
                                                ) : (
                                                    <span className="text-emerald-600 dark:text-emerald-400">
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="max-w-md px-4 py-3 text-xs text-foreground">
                                                {entry.description ? (
                                                    <span className="break-words">
                                                        {entry.description}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
