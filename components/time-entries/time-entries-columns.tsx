"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { DeleteTimeEntryDialog } from "@/components/time-entries/delete-time-entry-dialog";
import { StopTimeEntryButton } from "@/components/time-entries/stop-time-entry-button";
import { TimeEntryDialog } from "@/components/time-entries/time-entry-dialog";
import { Button } from "@/components/ui/button";
import type { Task } from "@/types/task";
import type { TimeEntry } from "@/types/time-entry";
import { formatDuration } from "@/utils/time";

interface GetTimeEntriesColumnsParams {
    taskTitlesById: Record<string, string>;
    tasks: Task[];
    onChanged: () => void;
}

export function getTimeEntriesColumns({
    taskTitlesById,
    tasks,
    onChanged,
}: GetTimeEntriesColumnsParams): ColumnDef<TimeEntry>[] {
    return [
        {
            accessorKey: "taskId",
            header: "Task",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Link
                        href={`/time-entries/${row.original.id}`}
                        className="font-medium hover:text-primary hover:underline"
                    >
                        {taskTitlesById[row.original.taskId] ?? "Task"}
                    </Link>
                    {row.original.isRunning && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                            Running
                        </span>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "startTime",
            header: ({ column }) => (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 cursor-pointer font-medium"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Start Time
                    <ArrowUpDown className="ml-1.5 size-3.5" />
                </Button>
            ),
            cell: ({ row }) => (
                <span className="text-xs text-muted-foreground">
                    {new Date(row.original.startTime).toLocaleString()}
                </span>
            ),
        },
        {
            accessorKey: "endTime",
            header: "End Time",
            cell: ({ row }) =>
                row.original.endTime ? (
                    <span className="text-xs text-muted-foreground">
                        {new Date(row.original.endTime).toLocaleString()}
                    </span>
                ) : (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                        In progress
                    </span>
                ),
        },
        {
            accessorKey: "durationSeconds",
            header: "Duration",
            cell: ({ row }) => (
                <span className="font-mono text-xs font-medium">
                    {row.original.isRunning
                        ? "—"
                        : formatDuration(row.original.durationSeconds)}
                </span>
            ),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) =>
                row.original.description ? (
                    <span
                        title={row.original.description}
                        className="block max-w-xs truncate text-sm text-muted-foreground"
                    >
                        {row.original.description}
                    </span>
                ) : (
                    <span className="text-muted-foreground">—</span>
                ),
        },
        {
            id: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    {row.original.isRunning && (
                        <StopTimeEntryButton
                            id={row.original.id}
                            currentDescription={row.original.description}
                            onStopped={onChanged}
                        />
                    )}
                    <Link
                        href={`/time-entries/${row.original.id}`}
                        className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-medium transition-colors hover:bg-muted"
                    >
                        <Eye className="size-3.5" />
                        View
                    </Link>
                    <TimeEntryDialog
                        entry={row.original}
                        tasks={tasks}
                        onSaved={onChanged}
                    />
                    <DeleteTimeEntryDialog
                        entryId={row.original.id}
                        onDeleted={onChanged}
                    />
                </div>
            ),
        },
    ];
}

