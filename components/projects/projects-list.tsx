"use client";

import { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { getProjectsColumns } from "@/components/projects/projects-columns";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCompanies } from "@/hooks/use-companies";
import { useProjects } from "@/hooks/use-projects";
import { useTechnologies } from "@/hooks/use-technologies";

export function ProjectsList() {
    const [selectedCompanyId, setSelectedCompanyId] = useState("");
    const { companies } = useCompanies();
    const { technologies } = useTechnologies();
    const { projects, isLoading, errorMessage, refresh } = useProjects(
        selectedCompanyId || undefined
    );

    const companyNamesById = useMemo(
        () =>
            Object.fromEntries(
                companies.map((company) => [company.id, company.name])
            ),
        [companies]
    );

    const columns = useMemo(
        () =>
            getProjectsColumns({
                companyNamesById,
                companies,
                technologies,
                onChanged: refresh,
            }),
        [companyNamesById, companies, technologies, refresh]
    );

    return (
        <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6">
            <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-sm text-muted-foreground">
                        Browse projects across your companies and track their technologies and status.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        aria-label="Filter by company"
                        value={selectedCompanyId}
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                        className="h-8 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                        <option value="">All Companies</option>
                        {companies.map((company) => (
                            <option key={company.id} value={company.id}>
                                {company.name}
                            </option>
                        ))}
                    </select>

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

                    <ProjectDialog
                        companies={companies}
                        technologies={technologies}
                        onSaved={refresh}
                    />
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
                data={projects}
                searchKey="name"
                searchPlaceholder="Search projects..."
                isLoading={isLoading}
                emptyMessage="No projects found."
            />
        </main>
    );
}
