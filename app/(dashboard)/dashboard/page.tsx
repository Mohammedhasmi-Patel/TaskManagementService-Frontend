import { Suspense } from "react";
import type { Metadata } from "next";
import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export const metadata: Metadata = {
    title: "Dashboard | Task Management",
    description: "View your task management statistics and workspace overview.",
};

export default function DashboardPage() {
    return (
        <Suspense>
            <DashboardOverview />
        </Suspense>
    );
}
