"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Eye } from "lucide-react";
import { DeleteTechnologyDialog } from "@/components/technologies/delete-technology-dialog";
import { TechnologyDialog } from "@/components/technologies/technology-dialog";
import { TechnologyLogo } from "@/components/technologies/technology-logo";
import { Button } from "@/components/ui/button";
import type { Technology } from "@/types/technology";

export function getTechnologiesColumns(
    onChanged: () => void
): ColumnDef<Technology>[] {
    return [
        {
            id: "logo",
            accessorKey: "logo",
            header: "Logo",
            enableSorting: false,
            cell: ({ row }) => (
                <TechnologyLogo
                    src={row.original.logo}
                    name={row.original.name}
                />
            ),
        },
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
                    Technology
                    <ArrowUpDown className="ml-1.5 size-3.5" />
                </Button>
            ),
            cell: ({ row }) => (
                <Link
                    href={`/technologies/${row.original.id}`}
                    className="font-medium hover:text-primary hover:underline"
                >
                    {row.original.name}
                </Link>
            ),
        },
        {
            accessorKey: "slug",
            header: "Slug",
            cell: ({ row }) => (
                <code className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                    {row.original.slug}
                </code>
            ),
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => {
                const description = row.original.description;
                if (!description) {
                    return <span className="text-muted-foreground">—</span>;
                }
                return (
                    <span
                        title={description}
                        className="block max-w-sm truncate text-sm text-muted-foreground"
                    >
                        {description}
                    </span>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Link
                        href={`/technologies/${row.original.id}`}
                        className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-medium transition-colors hover:bg-muted"
                    >
                        <Eye className="size-3.5" />
                        View
                    </Link>
                    <TechnologyDialog
                        technology={row.original}
                        onSaved={onChanged}
                    />
                    <DeleteTechnologyDialog
                        technology={row.original}
                        onDeleted={onChanged}
                    />
                </div>
            ),
        },
    ];
}

