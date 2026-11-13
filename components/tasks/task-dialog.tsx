"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { TaskForm } from "@/components/tasks/task-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";
import type { Technology } from "@/types/technology";

interface TaskDialogProps {
    task?: Task;
    projects: Project[];
    technologies: Technology[];
    onSaved: () => void;
}

export function TaskDialog({
    task,
    projects,
    technologies,
    onSaved,
}: TaskDialogProps) {
    const [open, setOpen] = useState(false);
    const isEdit = Boolean(task);

    const handleSuccess = () => {
        setOpen(false);
        onSaved();
    };

    return (
        <>
            <Button
                type="button"
                variant={isEdit ? "outline" : "default"}
                size={isEdit ? "sm" : "default"}
                onClick={() => setOpen(true)}
                className="cursor-pointer"
            >
                {isEdit ? (
                    <>
                        <Pencil className="size-3.5" />
                        Edit
                    </>
                ) : (
                    <>
                        <Plus className="size-4" />
                        Add Task
                    </>
                )}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? "Edit Task" : "Create Task"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? "Update task details, status, priority, or technologies."
                                : "Create a new task inside one of your projects."}
                        </DialogDescription>
                    </DialogHeader>

                    {open && (
                        <TaskForm
                            task={task}
                            projects={projects}
                            technologies={technologies}
                            onCancel={() => setOpen(false)}
                            onSuccess={handleSuccess}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

