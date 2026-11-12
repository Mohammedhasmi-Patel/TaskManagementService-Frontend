import type { LucideIcon } from "lucide-react";
import { cn } from "cn";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface StatCardProps {
    label: string;
    value: number;
    description: string;
    icon: LucideIcon;
    iconClassName?: string;
    isLoading?: boolean;
}

export function StatCard({
    label,
    value,
    description,
    icon: Icon,
    iconClassName,
    isLoading = false,
}: StatCardProps) {
    return (
        <Card className="border-border/80 shadow-xs transition-shadow hover:shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {label}
                </CardTitle>
                <div
                    className={cn(
                        "flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
                        iconClassName
                    )}
                >
                    <Icon className="size-4" strokeWidth={2} />
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                {isLoading ? (
                    <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                ) : (
                    <p className="text-3xl font-bold tracking-tight">{value}</p>
                )}
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}
