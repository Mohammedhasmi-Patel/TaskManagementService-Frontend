import { Suspense } from "react";
import type { Metadata } from "next";
import { ProjectsList } from "@/components/projects/projects-list";

export const metadata: Metadata = {
    title: "Projects | Task Management",
    description: "View and filter projects across your companies.",
};

export default function ProjectsPage() {
    return (
        <Suspense>
            <ProjectsList />
        </Suspense>
    );
}
