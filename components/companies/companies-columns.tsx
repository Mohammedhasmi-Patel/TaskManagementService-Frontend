"use client";

import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink, Eye, Star } from "lucide-react";
import { CompanyLogo } from "@/components/companies/company-logo";
import { EditCompanyDialog } from "@/components/companies/edit-company-dialog";
import { Button } from "@/components/ui/button";
import type { Company } from "@/types/company";

export function getCompaniesColumns(onUpdated: () => void): ColumnDef<Company>[] {
    return [
        {
            id: "logo",
            accessorKey: "logo",
            header: "Logo",
            enableSorting: false,
            cell: ({ row }) => {
                const company = row.original;
                return <CompanyLogo src={company.logo} name={company.name} />;
            },
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
                    Company
                    <ArrowUpDown className="ml-1.5 size-3.5" />
                </Button>
            ),
            cell: ({ row }) => (
                <Link
                    href={`/companies/${row.original.id}`}
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
                    /{row.original.slug}
                </code>
            ),
        },
        {
            accessorKey: "website",
            header: "Website",
            cell: ({ row }) => {
                const website = row.original.website;
                if (!website) {
                    return <span className="text-muted-foreground">—</span>;
                }
                return (
                    <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex max-w-xs items-center gap-1.5 text-primary hover:underline"
                    >
                        <span className="truncate">{website}</span>
                        <ExternalLink className="size-3.5 shrink-0" />
                    </a>
                );
            },
        },
        {
            accessorKey: "isDefault",
            header: "Default",
            cell: ({ row }) =>
                row.original.isDefault ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        <Star className="size-3 fill-current" />
                        Default
                    </span>
                ) : (
                    <span className="text-muted-foreground">—</span>
                ),
        },
        {
            id: "actions",
            header: "Actions",
            enableSorting: false,
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Link
                        href={`/companies/${row.original.id}`}
                        className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-xs font-medium transition-colors hover:bg-muted"
                    >
                        <Eye className="size-3.5" />
                        View
                    </Link>
                    <EditCompanyDialog
                        company={row.original}
                        onUpdated={onUpdated}
                    />
                </div>
            ),
        },
    ];
}
