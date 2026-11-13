import { Suspense } from "react";
import type { Metadata } from "next";
import { TimeEntriesList } from "@/components/time-entries/time-entries-list";

export const metadata: Metadata = {
    title: "Time Entries | Task Management",
    description: "Track work sessions, start timers, and log time per task.",
};

export default function TimeEntriesPage() {
    return (
        <Suspense>
            <TimeEntriesList />
        </Suspense>
    );
}
