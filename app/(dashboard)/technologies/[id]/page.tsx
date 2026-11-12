import { Suspense } from "react";
import type { Metadata } from "next";
import { TechnologyDetails } from "@/components/technologies/technology-details";

export const metadata: Metadata = {
    title: "Technology Details | Task Management",
    description: "View, edit, or delete a technology.",
};

export default function TechnologyDetailPage() {
    return (
        <Suspense>
            <TechnologyDetails />
        </Suspense>
    );
}

