"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ExternalLink, RefreshCw, Star } from "lucide-react";
import { CompanyLogo } from "@/components/companies/company-logo";
import { EditCompanyDialog } from "@/components/companies/edit-company-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompany } from "@/hooks/use-company";

export function CompanyDetails() {
    const params = useParams<{ id: string }>();
    const { company, isLoading, errorMessage, refresh } = useCompany(params?.id);

    return (
        <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href="/companies"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back to Companies
                </Link>

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={refresh}
                        disabled={isLoading}
                        className="cursor-pointer"
                    >
                        <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    {company && (
                        <EditCompanyDialog company={company} onUpdated={refresh} />
                    )}
                </div>
            </div>

            {isLoading ? (
                <Card className="border-border/80">
                    <CardContent className="space-y-4 py-6">
                        <div className="flex items-center gap-4">
                            <div className="size-16 animate-pulse rounded-lg bg-muted" />
                            <div className="space-y-2">
                                <div className="h-6 w-48 animate-pulse rounded bg-muted" />
                                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                            </div>
                        </div>
                        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
                    </CardContent>
                </Card>
            ) : errorMessage || !company ? (
                <Card className="border-destructive/40 bg-destructive/5">
                    <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-destructive">
                            {errorMessage || "Company not found."}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={refresh}
                                className="cursor-pointer"
                            >
                                Retry
                            </Button>
                            <Link
                                href="/companies"
                                className="inline-flex h-7 items-center rounded-lg border border-border bg-background px-2.5 text-xs font-medium hover:bg-muted"
                            >
                                All Companies
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-border/80 shadow-xs">
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <CompanyLogo
                                src={company.logo}
                                name={company.name}
                                className="size-16 rounded-xl"
                            />
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-bold">
                                    {company.name}
                                </CardTitle>
                                <code className="inline-block rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                    /{company.slug}
                                </code>
                            </div>
                        </div>

                        {company.isDefault && (
                            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                <Star className="size-3.5 fill-current" />
                                Default Company
                            </span>
                        )}
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Company ID
                            </p>
                            <p className="font-mono text-sm break-all">{company.id}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Slug
                            </p>
                            <p className="text-sm">/{company.slug}</p>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Website
                            </p>
                            {company.website ? (
                                <a
                                    href={company.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                                >
                                    <span>{company.website}</span>
                                    <ExternalLink className="size-4 shrink-0" />
                                </a>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    No website provided
                                </p>
                            )}
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Description
                            </p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {company.description || "No description provided"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </main>
    );
}

