"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { TimeEntryForm } from "@/components/time-entries/time-entry-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Task } from "@/types/task";
import type { TimeEntry } from "@/types/time-entry";

interface TimeEntryDialogProps {
    entry?: TimeEntry;
    tasks: Task[];
    defaultTaskId?: string;
    initialMode?: "timer" | "manual";
    triggerLabel?: string;
    triggerVariant?: "default" | "outline" | "secondary";
    triggerSize?: "default" | "sm" | "icon";
    onSaved: () => void;
}

export function TimeEntryDialog({
    entry,
    tasks,
    defaultTaskId,
    initialMode = "manual",
    triggerLabel,
    triggerVariant,
    triggerSize,
    onSaved,
}: TimeEntryDialogProps) {
    const [open, setOpen] = useState(false);
    const isEdit = Boolean(entry);

    const handleSuccess = () => {
        setOpen(false);
        onSaved();
    };

    return (
        <>
            <Button
                type="button"
                variant={triggerVariant ?? (isEdit ? "outline" : "default")}
                size={triggerSize ?? (isEdit ? "sm" : "default")}
                onClick={() => setOpen(true)}
                className="cursor-pointer"
            >
                {isEdit ? (
                    <>
                        <Pencil className="size-3.5" />
                        {triggerLabel ?? "Edit"}
                    </>
                ) : (
                    <>
                        <Plus className="size-4" />
                        {triggerLabel ?? "Log Time"}
                    </>
                )}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? "Edit Time Entry" : "Log / Track Time"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? "Update the start/end time, duration, or notes."
                                : "Log past completed work manually or start a live timer."}
                        </DialogDescription>
                    </DialogHeader>

                    {open && (
                        <TimeEntryForm
                            entry={entry}
                            tasks={tasks}
                            defaultTaskId={defaultTaskId}
                            initialMode={initialMode}
                            onCancel={() => setOpen(false)}
                            onSuccess={handleSuccess}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

