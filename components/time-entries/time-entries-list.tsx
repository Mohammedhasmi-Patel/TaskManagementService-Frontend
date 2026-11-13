"use client";

import { useMemo, useState } from "react";
import { Clock, ListChecks, RefreshCw, RotateCcw } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { DateFilterBar } from "@/components/shared/date-filter-bar";
import { StartTimerButton } from "@/components/time-entries/start-timer-button";
import { getTimeEntriesColumns } from "@/components/time-entries/time-entries-columns";
import { TimeEntryDialog } from "@/components/time-entries/time-entry-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTasks } from "@/hooks/use-tasks";
import { useTimeEntries } from "@/hooks/use-time-entries";
import { getDateRangeBounds, type DateFilterPreset } from "@/utils/date-range";
import { formatDuration } from "@/utils/time";

export function TimeEntriesList() {
    const [selectedTaskId, setSelectedTaskId] = useState("");
    const [datePreset, setDatePreset] = useState<DateFilterPreset>("all");
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");

    const dateBounds = useMemo(
        () => getDateRangeBounds(datePreset, customFrom, customTo),
        [datePreset, customFrom, customTo]
    );

    const { tasks } = useTasks();
    const { timeEntries, isLoading, errorMessage, refresh } = useTimeEntries(
        selectedTaskId || undefined
    );

    const filteredEntries = useMemo(() => {
        const fromMs = dateBounds.fromDate ? Date.parse(dateBounds.fromDate) : null;
        const toMs = dateBounds.toDate ? Date.parse(dateBounds.toDate) : null;
        if (fromMs === null && toMs === null) return timeEntries;

        return timeEntries.filter((entry) => {
            const startMs = Date.parse(entry.startTime);
            if (Number.isNaN(startMs)) return true;
            if (fromMs !== null && startMs < fromMs) return false;
            if (toMs !== null && startMs > toMs) return false;
            return true;
        });
    }, [timeEntries, dateBounds.fromDate, dateBounds.toDate]);

    const totalDurationSeconds = useMemo(
        () => filteredEntries.reduce((sum, entry) => sum + entry.durationSeconds, 0),
        [filteredEntries]
    );

    const taskTitlesById = useMemo(
        () => Object.fromEntries(tasks.map((task) => [task.id, task.title])),
        [tasks]
    );

    const columns = useMemo(
        () => getTimeEntriesColumns({ taskTitlesById, tasks, onChanged: refresh }),
        [taskTitlesById, tasks, refresh]
    );

    const hasActiveFilters = Boolean(selectedTaskId || datePreset !== "all");
    const resetFilters = () => {
        setSelectedTaskId("");
        setDatePreset("all");
        setCustomFrom("");
        setCustomTo("");
    };

    const totalHours = Math.round((totalDurationSeconds / 3600) * 100) / 100;

    return (
        <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6">
            <header className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Time Entries</h1>
                    <p className="text-sm text-muted-foreground">
                        Start live timers, stop running entries, and filter logged hours by date.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    <Button type="button" variant="outline" onClick={refresh} disabled={isLoading} className="cursor-pointer">
                        <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <StartTimerButton
                        taskId={selectedTaskId}
                        size="default"
                        disabled={!selectedTaskId}
                        title={selectedTaskId ? "Start timer for selected task" : "Select a task in the filter to start a timer"}
                        onStarted={refresh}
                    />
                    <TimeEntryDialog tasks={tasks} onSaved={refresh} />
                </div>
            </header>

            <section aria-label="Time entry filters" className="flex flex-col gap-3 rounded-xl border bg-card p-3.5 shadow-xs">
                <DateFilterBar
                    preset={datePreset}
                    customFrom={customFrom}
                    customTo={customTo}
                    onPresetChange={setDatePreset}
                    onCustomFromChange={setCustomFrom}
                    onCustomToChange={setCustomTo}
                />

                <div className="flex flex-wrap items-center gap-2 border-t pt-3">
                    <select aria-label="Filter by task" value={selectedTaskId} onChange={(e) => setSelectedTaskId(e.target.value)} className="h-8 rounded-lg border border-input bg-background px-3 text-xs font-medium outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50">
                        <option value="">All Tasks</option>
                        {tasks.map((task) => (<option key={task.id} value={task.id}>{task.title}</option>))}
                    </select>

                    {hasActiveFilters && (
                        <Button type="button" variant="ghost" size="sm" onClick={resetFilters} className="cursor-pointer text-xs text-muted-foreground">
                            <RotateCcw className="size-3.5" />
                            Reset
                        </Button>
                    )}
                </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card className="border-border/80 shadow-xs">
                    <CardContent className="flex items-center justify-between py-4">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Total Entries</p>
                            <p className="text-xl font-bold">{filteredEntries.length}</p>
                        </div>
                        <ListChecks className="size-5 text-emerald-600" />
                    </CardContent>
                </Card>
                <Card className="border-border/80 shadow-xs">
                    <CardContent className="flex items-center justify-between py-4">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">Total Hours</p>
                            <p className="text-xl font-bold">{totalHours}h ({formatDuration(totalDurationSeconds)})</p>
                        </div>
                        <Clock className="size-5 text-amber-600" />
                    </CardContent>
                </Card>
            </section>

            {errorMessage && (
                <Card className="border-destructive/40 bg-destructive/5">
                    <CardContent className="flex items-center justify-between gap-4 py-4">
                        <p className="text-sm text-destructive">{errorMessage}</p>
                        <Button type="button" size="sm" variant="outline" onClick={refresh} className="cursor-pointer">Retry</Button>
                    </CardContent>
                </Card>
            )}

            <DataTable
                columns={columns}
                data={filteredEntries}
                searchKey="description"
                searchPlaceholder="Search descriptions..."
                isLoading={isLoading}
                emptyMessage="No time entries found."
            />
        </main>
    );
}
