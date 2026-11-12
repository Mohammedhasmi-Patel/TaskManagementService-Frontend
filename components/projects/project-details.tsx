"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { DeleteProjectDialog } from "@/components/projects/delete-project-dialog";
import { ProjectDialog } from "@/components/projects/project-dialog";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompanies } from "@/hooks/use-companies";
import { useProject } from "@/hooks/use-project";
import { useTechnologies } from "@/hooks/use-technologies";

export function ProjectDetails() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const { project, isLoading, errorMessage, refresh } = useProject(params?.id);
    const { companies } = useCompanies();
    const { technologies } = useTechnologies();

    const companyName = companies.find((c) => c.id === project?.companyId)?.name;

    const handleDeleted = () => {
        router.replace("/projects");
        router.refresh();
    };

    return (
        <main className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                    <ArrowLeft className="size-4" />
                    Back to Projects
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
                    {project && (
                        <>
                            <ProjectDialog
                                project={project}
                                companies={companies}
                                technologies={technologies}
                                onSaved={refresh}
                            />
                            <DeleteProjectDialog
                                project={project}
                                onDeleted={handleDeleted}
                            />
                        </>
                    )}
                </div>
            </div>

            {isLoading ? (
                <Card className="border-border/80">
                    <CardContent className="space-y-4 py-6">
                        <div className="h-6 w-56 animate-pulse rounded bg-muted" />
                        <div className="h-4 w-36 animate-pulse rounded bg-muted" />
                        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
                    </CardContent>
                </Card>
            ) : errorMessage || !project ? (
                <Card className="border-destructive/40 bg-destructive/5">
                    <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-destructive">
                            {errorMessage || "Project not found."}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button type="button" size="sm" variant="outline" onClick={refresh} className="cursor-pointer">
                                Retry
                            </Button>
                            <Link
                                href="/projects"
                                className="inline-flex h-7 items-center rounded-lg border border-border bg-background px-2.5 text-xs font-medium hover:bg-muted"
                            >
                                All Projects
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-border/80 shadow-xs">
                    <CardHeader className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold">{project.name}</CardTitle>
                            <code className="inline-block rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                /{project.slug}
                            </code>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <ProjectStatusBadge status={project.status} />
                            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                {project.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2">
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Company</p>
                            <Link href={`/companies/${project.companyId}`} className="text-sm font-medium text-primary hover:underline">
                                {companyName ?? project.companyId}
                            </Link>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Timeline</p>
                            <p className="text-sm text-muted-foreground">
                                {project.startDate || project.endDate
                                    ? `${project.startDate ?? "?"} → ${project.endDate ?? "Ongoing"}`
                                    : "Not specified"}
                            </p>
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Project ID</p>
                            <p className="font-mono text-sm break-all">{project.id}</p>
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Technologies</p>
                            {project.technologies.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {project.technologies.map((tech) => (
                                        <Link key={tech.id} href={`/technologies/${tech.id}`} className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium hover:bg-muted/80">
                                            {tech.name}
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">No technologies linked</p>
                            )}
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Description</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {project.description || "No description provided"}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </main>
    );
}

