"use client";

import { useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { getCompaniesColumns } from "@/components/companies/companies-columns";
import { CreateCompanyDialog } from "@/components/companies/create-company-dialog";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCompanies } from "@/hooks/use-companies";

export function CompaniesList() {
    const { companies, isLoading, errorMessage, refresh } = useCompanies();
    const columns = useMemo(() => getCompaniesColumns(refresh), [refresh]);

    return (
        <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6">
            <header className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Companies</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage the companies associated with your projects and tasks.
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
                    <CreateCompanyDialog onCreated={refresh} />
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
                data={companies}
                searchKey="name"
                searchPlaceholder="Search companies..."
                isLoading={isLoading}
                emptyMessage="No companies found."
            />
        </main>
    );
}
