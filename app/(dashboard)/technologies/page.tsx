import { Suspense } from "react";
import type { Metadata } from "next";
import { TechnologiesList } from "@/components/technologies/technologies-list";

export const metadata: Metadata = {
    title: "Technologies | Task Management",
    description: "Manage technologies used across projects and tasks.",
};

export default function TechnologiesPage() {
    return (
        <Suspense>
            <TechnologiesList />
        </Suspense>
    );
}
