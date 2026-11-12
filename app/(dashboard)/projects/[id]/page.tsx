import { Suspense } from "react";
import type { Metadata } from "next";
import { ProjectDetails } from "@/components/projects/project-details";

export const metadata: Metadata = {
    title: "Project Details | Task Management",
    description: "View, edit, or delete a project.",
};

export default function ProjectDetailPage() {
    return (
        <Suspense>
            <ProjectDetails />
        </Suspense>
    );
}

