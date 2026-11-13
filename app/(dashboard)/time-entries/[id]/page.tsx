import { Suspense } from "react";
import type { Metadata } from "next";
import { TimeEntryDetails } from "@/components/time-entries/time-entry-details";

export const metadata: Metadata = {
    title: "Time Entry Details | Task Management",
    description: "View, stop, edit, or delete a time entry.",
};

export default function TimeEntryDetailPage() {
    return (
        <Suspense>
            <TimeEntryDetails />
        </Suspense>
    );
}

