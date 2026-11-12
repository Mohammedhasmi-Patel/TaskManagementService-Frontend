"use client";

import {
    Building2,
    Clock,
    Cpu,
    FolderKanban,
    ListTodo,
    RefreshCw,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDashboardStatistics } from "@/hooks/use-dashboard-statistics";

export function DashboardOverview() {
    const { stats, isLoading, errorMessage, refresh } = useDashboardStatistics();

    const cards = [
        {
            key: "companies",
            label: "Total Companies",
            value: stats.totalCompanies,
            description: "Companies registered in your workspace",
            icon: Building2,
            iconClassName: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
            href: "/companies",
        },
        {
            key: "technologies",
            label: "Total Technologies",
            value: stats.totalTechnologies,
            description: "Technologies tracked across projects",
            icon: Cpu,
            iconClassName: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
            href: "/technologies",
        },
        {
            key: "projects",
            label: "Total Projects",
            value: stats.totalProjects,
            description: "Projects across your companies",
            icon: FolderKanban,
            iconClassName: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
            href: "/projects",
        },
        {
            key: "tasks",
            label: "Total Tasks",
            value: stats.totalTasks,
            description: "Tasks created across all projects",
            icon: ListTodo,
            iconClassName: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        },
        {
            key: "time-entries",
            label: "Total Time Entries",
            value: stats.totalTimeEntries,
            description: "Logged work sessions and timers",
            icon: Clock,
            iconClassName: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
        },
    ];

    return (
        <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6">
            <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of your workspace companies, projects, tasks, technologies, and time entries.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    onClick={refresh}
                    disabled={isLoading}
                    className="cursor-pointer self-start sm:self-auto"
                >
                    <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </header>

            {errorMessage && (
                <Card className="border-destructive/40 bg-destructive/5">
                    <CardContent className="flex items-center justify-between gap-4 py-4">
                        <p className="text-sm text-destructive">{errorMessage}</p>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={refresh}
                            className="cursor-pointer"
                        >
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            )}

            <section
                aria-label="Dashboard statistics"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
            >
                {cards.map((card) => (
                    <StatCard
                        key={card.key}
                        label={card.label}
                        value={card.value}
                        description={card.description}
                        icon={card.icon}
                        iconClassName={card.iconClassName}
                        href={card.href}
                        isLoading={isLoading}
                    />
                ))}
            </section>
        </main>
    );
}
