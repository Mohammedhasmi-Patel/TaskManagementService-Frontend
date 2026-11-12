import { cn } from "cn";

const STATUS_STYLES: Record<string, string> = {
    Planned: "bg-slate-500/10 text-slate-700 dark:text-slate-300",
    InProgress: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    OnHold: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
    Completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    Cancelled: "bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

export function ProjectStatusBadge({ status }: { status: string }) {
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

