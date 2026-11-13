"use client";

import { useCallback, useMemo, useState } from "react";
import { RefreshCw, RotateCcw } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { DateFilterBar } from "@/components/shared/date-filter-bar";
import { TaskDialog } from "@/components/tasks/task-dialog";
import { TaskSummaryCards } from "@/components/tasks/task-summary-cards";
import { getTasksColumns } from "@/components/tasks/tasks-columns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useProjects } from "@/hooks/use-projects";
import { useTasks } from "@/hooks/use-tasks";
import { useTechnologies } from "@/hooks/use-technologies";
import { useTimeEntries } from "@/hooks/use-time-entries";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/types/task";
import { getDateRangeBounds, type DateFilterPreset } from "@/utils/date-range";

const FILTER_SELECT_CLASS =
    "h-8 rounded-lg border border-input bg-background px-3 text-xs font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function TasksList() {
    const [projectId, setProjectId] = useState("");
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [datePreset, setDatePreset] = useState<DateFilterPreset>("all");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");

    const dateBounds = useMemo(
        () => getDateRangeBounds(datePreset, customFrom, customTo),
        [datePreset, customFrom, customTo]
    );

    const { projects } = useProjects();
    const { technologies } = useTechnologies();
    const { timeEntries, refresh: refreshEntries } = useTimeEntries();
    const { tasks, isLoading, errorMessage, refresh } = useTasks({
        projectId: projectId || undefined,
        status: status || undefined,
        priority: priority || undefined,
        fromDate: dateBounds.fromDate,
        toDate: dateBounds.toDate,
    });

    const filteredTasks = useMemo(() => {
        const fromMs = dateBounds.fromDate ? Date.parse(dateBounds.fromDate) : null;
        const toMs = dateBounds.toDate ? Date.parse(dateBounds.toDate) : null;
        if (fromMs === null && toMs === null) return tasks;

        return tasks.filter((task) => {
            const createdMs = Date.parse(task.createdAt);
            if (Number.isNaN(createdMs)) return true;
            if (fromMs !== null && createdMs < fromMs) return false;
            if (toMs !== null && createdMs > toMs) return false;
            return true;
        });
    }, [tasks, dateBounds.fromDate, dateBounds.toDate]);

    const { totalEstimatedHours, totalTrackedSeconds, trackedByTask, runningByTask } = useMemo(() => {
        const taskIdSet = new Set(filteredTasks.map((t) => t.id));
        const estimated = filteredTasks.reduce((sum, t) => sum + (t.estimatedHours ?? 0), 0);
        const trackedMap: Record<string, number> = {};
        const runningMap: Record<string, (typeof timeEntries)[number]> = {};
        let trackedTotal = 0;
        for (const entry of timeEntries) {
            trackedMap[entry.taskId] = (trackedMap[entry.taskId] ?? 0) + (entry.durationSeconds ?? 0);
            if (entry.isRunning || !entry.endTime) runningMap[entry.taskId] = entry;
            if (taskIdSet.has(entry.taskId)) trackedTotal += entry.durationSeconds;
        }
        return {
            totalEstimatedHours: estimated,
            totalTrackedSeconds: trackedTotal,
            trackedByTask: trackedMap,
            runningByTask: runningMap,
        };
    }, [filteredTasks, timeEntries]);

    const projectNamesById = useMemo(
        () => Object.fromEntries(projects.map((p) => [p.id, p.name])),
        [projects]
    );

    const handleRefresh = useCallback(() => {
        refresh();
        refreshEntries();
    }, [refresh, refreshEntries]);

    const hasActiveFilters = Boolean(
        projectId || status || priority || datePreset !== "all"
    );

    const resetFilters = () => {
        setProjectId("");
        setStatus("");
        setPriority("");
        setDatePreset("all");
        setCustomFrom("");
        setCustomTo("");
    };

    const columns = useMemo(
        () =>
            getTasksColumns({
                projectNamesById,
                projects,
                technologies,
                trackedSecondsByTaskId: trackedByTask,
                runningEntryByTaskId: runningByTask,
                onChanged: handleRefresh,
            }),
        [projectNamesById, projects, technologies, trackedByTask, runningByTask, handleRefresh]
    );

    return (
        <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6">
            <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-sm text-muted-foreground">
                        Create, filter by date or status, and track task totals and hours.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Button type="button" variant="outline" onClick={handleRefresh} disabled={isLoading} className="cursor-pointer">
                        <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <TaskDialog projects={projects} technologies={technologies} onSaved={handleRefresh} />
                </div>
            </header>

            <section aria-label="Task filters" className="flex flex-col gap-3 rounded-xl border bg-card p-3.5 shadow-xs">
                <DateFilterBar
                    preset={datePreset}
                    customFrom={customFrom}
                    customTo={customTo}
                    onPresetChange={setDatePreset}
                    onCustomFromChange={setCustomFrom}
                    onCustomToChange={setCustomTo}
                />

                <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                    <select aria-label="Filter by project" value={projectId} onChange={(e) => setProjectId(e.target.value)} className={FILTER_SELECT_CLASS}>
                        <option value="">All Projects</option>
                        {projects.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                    </select>

                    <select aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)} className={FILTER_SELECT_CLASS}>
                        <option value="">All Statuses</option>
                        {TASK_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>

                    <select aria-label="Filter by priority" value={priority} onChange={(e) => setPriority(e.target.value)} className={FILTER_SELECT_CLASS}>
                        <option value="">All Priorities</option>
                        {TASK_PRIORITIES.map((p) => (<option key={p} value={p}>{p}</option>))}
                    </select>

                    {hasActiveFilters && (
                        <Button type="button" variant="ghost" size="sm" onClick={resetFilters} className="cursor-pointer text-xs text-muted-foreground">
                            <RotateCcw className="size-3.5" />
                            Reset
                        </Button>
                    )}
                </div>
            </section>

            <TaskSummaryCards
                totalTasks={filteredTasks.length}
                totalEstimatedHours={totalEstimatedHours}
                totalTrackedSeconds={totalTrackedSeconds}
                isLoading={isLoading}
            />

            {errorMessage && (
                <Card className="border-destructive/40 bg-destructive/5">
                    <CardContent className="flex items-center justify-between gap-4 py-4">
                        <p className="text-sm text-destructive">{errorMessage}</p>
                        <Button type="button" size="sm" variant="outline" onClick={handleRefresh} className="cursor-pointer">Retry</Button>
                    </CardContent>
                </Card>
            )}

            <DataTable
                columns={columns}
                data={filteredTasks}
                searchKey="title"
                searchPlaceholder="Search tasks..."
                isLoading={isLoading}
                emptyMessage="No tasks found."
            />
        </main>
    );
}
