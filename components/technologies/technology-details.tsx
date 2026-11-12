"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { DeleteTechnologyDialog } from "@/components/technologies/delete-technology-dialog";
import { TechnologyDialog } from "@/components/technologies/technology-dialog";
import { TechnologyLogo } from "@/components/technologies/technology-logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTechnology } from "@/hooks/use-technology";

export function TechnologyDetails() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const { technology, isLoading, errorMessage, refresh } = useTechnology(params?.id);

    const handleDeleted = () => {
        router.replace("/technologies");
        router.refresh();
    };

    return (
        <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href="/technologies"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back to Technologies
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
                    {technology && (
                        <>
                            <TechnologyDialog technology={technology} onSaved={refresh} />
                            <DeleteTechnologyDialog
                                technology={technology}
                                onDeleted={handleDeleted}
                            />
                        </>
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
            ) : errorMessage || !technology ? (
                <Card className="border-destructive/40 bg-destructive/5">
                    <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-destructive">
                            {errorMessage || "Technology not found."}
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
                                href="/technologies"
                                className="inline-flex h-7 items-center rounded-lg border border-border bg-background px-2.5 text-xs font-medium hover:bg-muted"
                            >
                                All Technologies
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-border/80 shadow-xs">
                    <CardHeader className="border-b pb-6">
                        <div className="flex items-center gap-4">
                            <TechnologyLogo
                                src={technology.logo}
                                name={technology.name}
                                className="size-16 rounded-xl"
                            />
                            <div className="space-y-1">
                                <CardTitle className="text-2xl font-bold">
                                    {technology.name}
                                </CardTitle>
                                <code className="inline-block rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                    /{technology.slug}
                                </code>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Technology ID
                            </p>
                            <p className="font-mono text-sm break-all">{technology.id}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Slug
                            </p>
                            <p className="text-sm">/{technology.slug}</p>
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                                Description
                            </p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {technology.description || "No description provided"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </main>
    );
}

