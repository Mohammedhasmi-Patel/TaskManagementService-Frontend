import { Clock, Hourglass, ListTodo } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDuration } from "@/utils/time";

interface TaskSummaryCardsProps {
    totalTasks: number;
    totalEstimatedHours: number;
    totalTrackedSeconds: number;
    isLoading?: boolean;
}

export function TaskSummaryCards({
    totalTasks,
    totalEstimatedHours,
    totalTrackedSeconds,
    isLoading = false,
}: TaskSummaryCardsProps) {
    const trackedHours = Math.round((totalTrackedSeconds / 3600) * 100) / 100;

    const items = [
        {
            label: "Total Tasks",
            value: String(totalTasks),
            hint: "Tasks matching current filters",
            icon: ListTodo,
            badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        },
        {
            label: "Total Estimated Hours",
            value: `${Number(totalEstimatedHours.toFixed(2))}h`,
            hint: "Sum of estimated hours",
            icon: Hourglass,
            badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
        },
        {
            label: "Total Tracked Hours",
            value: `${trackedHours}h (${formatDuration(totalTrackedSeconds)})`,
            hint: "Logged time entries on these tasks",
            icon: Clock,
            badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        },
    ];

    return (
        <section
            aria-label="Filtered task totals"
            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
            {items.map(({ label, value, hint, icon: Icon, badgeClass }) => (
                <Card key={label} className="border-border/80 shadow-xs">
                    <CardContent className="flex items-center justify-between gap-3 py-4">
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">
                                {label}
                            </p>
                            {isLoading ? (
                                <div className="h-7 w-20 animate-pulse rounded bg-muted" />
                            ) : (
                                <p className="text-xl font-bold tracking-tight">
                                    {value}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">{hint}</p>
                        </div>
                        <div
                            className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${badgeClass}`}
                        >
                            <Icon className="size-5" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </section>
    );
}

