"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { DeleteTaskDialog } from "@/components/tasks/delete-task-dialog";
import { TaskPriorityBadge, TaskStatusBadge } from "@/components/tasks/task-badges";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskTimeEntriesCard } from "@/components/tasks/task-time-entries-card";
import { StartTimerButton } from "@/components/time-entries/start-timer-button";
import { StopTimeEntryButton } from "@/components/time-entries/stop-time-entry-button";
import { TimeEntryDialog } from "@/components/time-entries/time-entry-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjects } from "@/hooks/use-projects";
import { useTask } from "@/hooks/use-task";
import { useTechnologies } from "@/hooks/use-technologies";
import { useTimeEntries } from "@/hooks/use-time-entries";
import { formatDuration } from "@/utils/time";

export function TaskDetails() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const { task, isLoading, errorMessage, refresh } = useTask(params?.id);
    const { projects } = useProjects();
    const { technologies } = useTechnologies();
    const { timeEntries, refresh: refreshEntries } = useTimeEntries(task?.id);

    const projectName = projects.find((p) => p.id === task?.projectId)?.name;
    const runningEntry = timeEntries.find((e) => e.isRunning || !e.endTime);

    const entriesForCard = useMemo(() => {
        if (task?.timeEntries && task.timeEntries.length > 0) return task.timeEntries;
        return timeEntries.map((e) => ({
            description: e.description,
            startTime: e.startTime,
            endTime: e.endTime,
            totalTimeInSeconds: e.durationSeconds,
        }));
    }, [task?.timeEntries, timeEntries]);

    const totalTrackedSeconds = useMemo(
        () => entriesForCard.reduce((sum, e) => sum + (e.totalTimeInSeconds ?? 0), 0),
        [entriesForCard]
    );

    const handleRefreshAll = () => {
        refresh();
        refreshEntries();
    };

    const handleDeleted = () => {
        router.replace("/tasks");
        router.refresh();
    };

    return (
        <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href="/tasks"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back to Tasks
                </Link>

                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={handleRefreshAll} disabled={isLoading} className="cursor-pointer">
                        <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    {task && (
                        <>
                            {runningEntry ? (
                                <StopTimeEntryButton
                                    id={runningEntry.id}
                                    currentDescription={runningEntry.description}
                                    onStopped={handleRefreshAll}
                                />
                            ) : (
                                <StartTimerButton taskId={task.id} onStarted={handleRefreshAll} />
                            )}
                            <TimeEntryDialog
                                tasks={[task]}
                                defaultTaskId={task.id}
                                initialMode="manual"
                                triggerLabel="Log Past Time"
                                triggerVariant="outline"
                                triggerSize="sm"
                                onSaved={handleRefreshAll}
                            />
                            <TaskDialog task={task} projects={projects} technologies={technologies} onSaved={handleRefreshAll} />
                            <DeleteTaskDialog task={task} onDeleted={handleDeleted} />
                        </>
                    )}
                </div>
            </div>

            {isLoading ? (
                <Card className="border-border/80">
                    <CardContent className="space-y-4 py-6">
                        <div className="h-6 w-56 animate-pulse rounded bg-muted" />
                        <div className="h-4 w-36 animate-pulse rounded bg-muted" />
                        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
                    </CardContent>
                </Card>
            ) : errorMessage || !task ? (
                <Card className="border-destructive/40 bg-destructive/5">
                    <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-destructive">{errorMessage || "Task not found."}</p>
                        <div className="flex items-center gap-2">
                            <Button type="button" size="sm" variant="outline" onClick={refresh} className="cursor-pointer">Retry</Button>
                            <Link href="/tasks" className="inline-flex h-7 items-center rounded-lg border border-border bg-background px-2.5 text-xs font-medium hover:bg-muted">
                                All Tasks
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    <Card className="border-border/80 shadow-xs">
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
                        <div className="flex flex-wrap items-center gap-2">
                            <TaskStatusBadge status={task.status} />
                            <TaskPriorityBadge priority={task.priority} />
                        </div>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Project</p>
                            <Link href={`/projects/${task.projectId}`} className="text-sm font-medium text-primary hover:underline">
                                {projectName ?? task.projectId}
                            </Link>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Hours & Progress</p>
                            <div className="flex items-center gap-2">
                                {runningEntry && (
                                    <span className="inline-block size-2 animate-pulse rounded-full bg-emerald-500" title="Active timer" />
                                )}
                                <p className="text-sm font-semibold text-foreground">
                                    {formatDuration(totalTrackedSeconds)} tracked
                                </p>
                                {task.estimatedHours != null ? (
                                    <span className="text-sm text-muted-foreground">/ {task.estimatedHours}h est</span>
                                ) : (
                                    <span className="text-xs text-muted-foreground">(no estimate)</span>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Created</p>
                            <p className="text-sm text-muted-foreground">{new Date(task.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Task ID</p>
                            <p className="font-mono text-sm break-all">{task.id}</p>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Technologies</p>
                            {task.technologies.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {task.technologies.map((tech) => (
                                        <Link key={tech.id} href={`/technologies/${tech.id}`} className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium hover:bg-muted/80">
                                            {tech.name}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No technologies linked</p>
                            )}
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Description</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {task.description || "No description provided"}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <TaskTimeEntriesCard entries={entriesForCard} />
            </div>
            )}
        </main>
    );
}

