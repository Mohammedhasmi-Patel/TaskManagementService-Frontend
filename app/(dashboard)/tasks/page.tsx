import { Suspense } from "react";
import type { Metadata } from "next";
import { TasksList } from "@/components/tasks/tasks-list";

export const metadata: Metadata = {
    title: "Tasks | Task Management",
    description: "Create, filter, and manage tasks across projects.",
};

export default function TasksPage() {
    return (
        <Suspense>
            <TasksList />
        </Suspense>
    );
}
