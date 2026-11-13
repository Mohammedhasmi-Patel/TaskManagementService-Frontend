"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { TaskPriorityBadge, TaskStatusBadge } from "@/components/tasks/task-badges";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { StartTimerButton } from "@/components/time-entries/start-timer-button";
import { StopTimeEntryButton } from "@/components/time-entries/stop-time-entry-button";
import { TimeEntryDialog } from "@/components/time-entries/time-entry-dialog";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";
import type { Technology } from "@/types/technology";
import type { TimeEntry } from "@/types/time-entry";
import { formatDuration } from "@/utils/time";

interface GetTasksColumnsParams {
    projectNamesById: Record<string, string>;
    projects: Project[];
    technologies: Technology[];
    trackedSecondsByTaskId?: Record<string, number>;
    runningEntryByTaskId?: Record<string, TimeEntry>;
    onChanged: () => void;
}

export function getTasksColumns({
    projectNamesById,
    projects,
    technologies,
    trackedSecondsByTaskId = {},
    runningEntryByTaskId = {},
    onChanged,
}: GetTasksColumnsParams): ColumnDef<Task>[] {
    return [
        {
            accessorKey: "title",
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
                    Title
                    <ArrowUpDown className="ml-1.5 size-3.5" />
                </Button>
            ),
            cell: ({ row }) => (
                <Link
                    href={`/tasks/${row.original.id}`}
                    className="font-medium hover:text-primary hover:underline"
                >
                    {row.original.title}
                </Link>
            ),
        },
        {
            accessorKey: "projectId",
            header: "Project",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {projectNamesById[row.original.projectId] ?? "—"}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <TaskStatusBadge status={row.original.status} />,
        },
        {
            accessorKey: "priority",
            header: "Priority",
            cell: ({ row }) => <TaskPriorityBadge priority={row.original.priority} />,
        },
        {
            id: "hours",
            header: "Hours (Tracked / Est)",
            cell: ({ row }) => {
                const trackedSec = trackedSecondsByTaskId[row.original.id] ?? 0;
                const est = row.original.estimatedHours;
                const running = runningEntryByTaskId[row.original.id];
                const trackedFormatted = formatDuration(trackedSec);

                if (!est && trackedSec === 0 && !running) {
                    return <span className="text-muted-foreground">—</span>;
                }

                return (
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                        {running && (
                            <span
                                className="inline-block size-2 animate-pulse rounded-full bg-emerald-500"
                                title="Timer actively running"
                            />
                        )}
                        <span className={trackedSec > 0 || running ? "text-foreground font-semibold" : "text-muted-foreground"}>
                            {trackedFormatted} tracked
                        </span>
                        {est != null && (
                            <span className="text-muted-foreground">/ {est}h est</span>
                        )}
                    </div>
                );
            },
        },
        {
            id: "technologies",
            header: "Technologies",
            enableSorting: false,
            cell: ({ row }) => {
                const techs = row.original.technologies;
                if (!techs.length) {
                    return <span className="text-muted-foreground">—</span>;
                }
                const visible = techs.slice(0, 2);
                const extra = techs.length - visible.length;
                return (
                    <div className="flex flex-wrap items-center gap-1">
                        {visible.map((tech) => (
                            <span
                                key={tech.id}
                                className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                            >
                                {tech.name}
                            </span>
                        ))}
                        {extra > 0 && (
                            <span className="text-xs text-muted-foreground">+{extra}</span>
                        )}
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => {
                const runningEntry = runningEntryByTaskId[row.original.id];
                return (
                    <div className="flex items-center gap-2">
                        {runningEntry ? (
                            <StopTimeEntryButton
                                id={runningEntry.id}
                                currentDescription={runningEntry.description}
                                onStopped={onChanged}
                            />
                        ) : row.original.status === "Completed" ? (
                            <TimeEntryDialog
                                tasks={[row.original]}
                                defaultTaskId={row.original.id}
                                initialMode="manual"
                                triggerLabel="Log Time"
                                triggerVariant="secondary"
                                triggerSize="sm"
                                onSaved={onChanged}
                            />
                        ) : (
                            <StartTimerButton
                                taskId={row.original.id}
                                label="Start"
                                onStarted={onChanged}
                            />
                        )}
                        <Link
                            href={`/tasks/${row.original.id}`}
                            className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-medium transition-colors hover:bg-muted"
                        >
                            <Eye className="size-3.5" />
                            View
                        </Link>
                        <TaskDialog
                            task={row.original}
                            projects={projects}
                            technologies={technologies}
                            onSaved={onChanged}
                        />
                        <DeleteTaskDialog
                            task={row.original}
                            onDeleted={onChanged}
                        />
                    </div>
                );
            },
        },
    ];
}

