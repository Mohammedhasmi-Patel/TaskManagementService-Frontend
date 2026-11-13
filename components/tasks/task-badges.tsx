import { cn } from "cn";

const STATUS_STYLES: Record<string, string> = {
    Todo: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    InProgress: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    InReview: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
    Completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Blocked: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    Cancelled: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

const PRIORITY_STYLES: Record<string, string> = {
    Low: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    Medium: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    High: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    Critical: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

export function TaskStatusBadge({ status }: { status: string }) {
    return (
        <span
            className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                STATUS_STYLES[status] ?? "bg-muted text-foreground"
            )}
        >
            {status}
        </span>
    );
}

export function TaskPriorityBadge({ priority }: { priority: string }) {
    return (
        <span
            className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                PRIORITY_STYLES[priority] ?? "bg-muted text-foreground"
            )}
        >
            {priority}
        </span>
    );
}

