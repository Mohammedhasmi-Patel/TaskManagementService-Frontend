"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { DeleteTimeEntryDialog } from "@/components/time-entries/delete-time-entry-dialog";
import { StopTimeEntryButton } from "@/components/time-entries/stop-time-entry-button";
import { TimeEntryDialog } from "@/components/time-entries/time-entry-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTasks } from "@/hooks/use-tasks";
import { useTimeEntry } from "@/hooks/use-time-entry";
import { formatDuration } from "@/utils/time";

export function TimeEntryDetails() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const { timeEntry, isLoading, errorMessage, refresh } = useTimeEntry(params?.id);
    const { tasks } = useTasks();

    const taskTitle = tasks.find((t) => t.id === timeEntry?.taskId)?.title;

    const handleDeleted = () => {
        router.replace("/time-entries");
        router.refresh();
    };

    return (
        <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href="/time-entries"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back to Time Entries
                </Link>

                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={refresh} disabled={isLoading} className="cursor-pointer">
                        <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    {timeEntry && (
                        <>
                            {timeEntry.isRunning && (
                                <StopTimeEntryButton
                                    id={timeEntry.id}
                                    currentDescription={timeEntry.description}
                                    onStopped={refresh}
                                />
                            )}
                            <TimeEntryDialog entry={timeEntry} tasks={tasks} onSaved={refresh} />
                            <DeleteTimeEntryDialog entryId={timeEntry.id} onDeleted={handleDeleted} />
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
            ) : errorMessage || !timeEntry ? (
                <Card className="border-destructive/40 bg-destructive/5">
                    <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-destructive">{errorMessage || "Time entry not found."}</p>
                        <div className="flex items-center gap-2">
                            <Button type="button" size="sm" variant="outline" onClick={refresh} className="cursor-pointer">Retry</Button>
                            <Link href="/time-entries" className="inline-flex h-7 items-center rounded-lg border border-border bg-background px-2.5 text-xs font-medium hover:bg-muted">
                                All Time Entries
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-border/80 shadow-xs">
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold">
                                {taskTitle ?? "Time Entry"}
                            </CardTitle>
                            <p className="font-mono text-xs text-muted-foreground">{timeEntry.id}</p>
                        </div>
                        {timeEntry.isRunning ? (
                            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                                Running
                            </span>
                        ) : (
                            <span className="inline-flex w-fit rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                Completed ({formatDuration(timeEntry.durationSeconds)})
                            </span>
                        )}
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Task</p>
                            <Link href={`/tasks/${timeEntry.taskId}`} className="text-sm font-medium text-primary hover:underline">
                                {taskTitle ?? timeEntry.taskId}
                            </Link>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Duration</p>
                            <p className="font-mono text-sm">
                                {timeEntry.isRunning ? "Running..." : `${formatDuration(timeEntry.durationSeconds)} (${timeEntry.durationSeconds}s)`}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Start Time</p>
                            <p className="text-sm text-muted-foreground">{new Date(timeEntry.startTime).toLocaleString()}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">End Time</p>
                            <p className="text-sm text-muted-foreground">
                                {timeEntry.endTime ? new Date(timeEntry.endTime).toLocaleString() : "Still running"}
                            </p>
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Description</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {timeEntry.description || "No description provided"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </main>
    );
}

