"use client";

import { useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { DataTable } from "@/components/shared/data-table";
import { getTechnologiesColumns } from "@/components/technologies/technologies-columns";
import { TechnologyDialog } from "@/components/technologies/technology-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTechnologies } from "@/hooks/use-technologies";

export function TechnologiesList() {
    const { technologies, isLoading, errorMessage, refresh } = useTechnologies();
    const columns = useMemo(() => getTechnologiesColumns(refresh), [refresh]);

    return (
        <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6">
            <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Technologies</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage the technologies used across your projects and tasks.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={refresh}
                        disabled={isLoading}
                        className="cursor-pointer"
                    >
                        <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <TechnologyDialog onSaved={refresh} />
                </div>
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

            <DataTable
                columns={columns}
                data={technologies}
                searchKey="name"
                searchPlaceholder="Search technologies..."
                isLoading={isLoading}
                emptyMessage="No technologies found."
            />
        </main>
    );
}

