"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { Button } from "@/components/ui/button";
import type { Company } from "@/types/company";
import type { Project } from "@/types/project";
import type { Technology } from "@/types/technology";

interface GetProjectsColumnsParams {
    companyNamesById: Record<string, string>;
    companies: Company[];
    technologies: Technology[];
    onChanged: () => void;
}

export function getProjectsColumns({
    companyNamesById,
    companies,
    technologies,
    onChanged,
}: GetProjectsColumnsParams): ColumnDef<Project>[] {
    return [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="-ml-3 h-8 cursor-pointer font-medium"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Project
                    <ArrowUpDown className="ml-1.5 size-3.5" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="space-y-0.5">
                    <Link
                        href={`/projects/${row.original.id}`}
                        className="font-medium hover:text-primary hover:underline"
                    >
                        {row.original.name}
                    </Link>
                    <div>
                        <code className="text-xs text-muted-foreground">
                            /{row.original.slug}
                        </code>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "companyId",
            header: "Company",
            cell: ({ row }) => (
                <span className="text-sm text-muted-foreground">
                    {companyNamesById[row.original.companyId] ?? "—"}
                </span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => <ProjectStatusBadge status={row.original.status} />,
        },
        {
            id: "technologies",
            header: "Technologies",
            enableSorting: false,
            cell: ({ row }) => {
                const techs = row.original.technologies;
                if (!techs.length) {
                    return <span className="text-muted-foreground">—</span>;
                }
                const visible = techs.slice(0, 3);
                const extra = techs.length - visible.length;
                return (
                    <div className="flex flex-wrap items-center gap-1">
                        {visible.map((tech) => (
                            <span
                                key={tech.id}
                                className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-foreground"
                            >
                                {tech.name}
                            </span>
                        ))}
                        {extra > 0 && (
                            <span className="text-xs text-muted-foreground">+{extra}</span>
                        )}
                    </div>
                );
            },
        },
        {
            id: "dates",
            header: "Timeline",
            enableSorting: false,
            cell: ({ row }) => {
                const { startDate, endDate } = row.original;
                if (!startDate && !endDate) {
                    return <span className="text-muted-foreground">—</span>;
                }
                return (
                    <span className="text-xs text-muted-foreground">
                        {startDate ?? "?"} → {endDate ?? "Ongoing"}
                    </span>
                );
            },
        },
        {
            accessorKey: "isActive",
            header: "State",
            cell: ({ row }) =>
                row.original.isActive ? (
                    <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        Active
                    </span>
                ) : (
                    <span className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        Inactive
                    </span>
                ),
        },
        {
            id: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Link
                        href={`/projects/${row.original.id}`}
                        className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-medium transition-colors hover:bg-muted"
                    >
                        <Eye className="size-3.5" />
                        View
                    </Link>
                    <ProjectDialog
                        project={row.original}
                        companies={companies}
                        technologies={technologies}
                        onSaved={onChanged}
                    />
                    <DeleteProjectDialog
                        project={row.original}
                        onDeleted={onChanged}
                    />
                </div>
            ),
        },
    ];
}
