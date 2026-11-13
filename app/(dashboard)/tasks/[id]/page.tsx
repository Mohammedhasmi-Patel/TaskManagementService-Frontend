import { Suspense } from "react";
import type { Metadata } from "next";
import { TaskDetails } from "@/components/tasks/task-details";

export const metadata: Metadata = {
    title: "Task Details | Task Management",
    description: "View, edit, or delete a task.",
};

export default function TaskDetailPage() {
    return (
        <Suspense>
            <TaskDetails />
        </Suspense>
    );
}

