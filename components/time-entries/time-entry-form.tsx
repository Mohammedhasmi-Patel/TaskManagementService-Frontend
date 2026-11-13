"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Clock, History, Loader2 } from "lucide-react";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/toast";
import {
    createTimeEntrySchema,
    type TimeEntryFormValues,
} from "@/schemas/time-entry.schema";
import { logoutUser } from "@/services/auth.service";
import {
    createTimeEntry,
    updateTimeEntry,
} from "@/services/time-entry.service";
import type { Task } from "@/types/task";
import type { TimeEntry } from "@/types/time-entry";
import { fromDateTimeLocalInput, toDateTimeLocalInput } from "@/utils/time";

interface TimeEntryFormProps {
    entry?: TimeEntry;
    tasks: Task[];
    defaultTaskId?: string;
    initialMode?: "timer" | "manual";
    onCancel: () => void;
    onSuccess: () => void;
}

const SELECT_CLASS =
    "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

export function TimeEntryForm({
    entry,
    tasks,
    defaultTaskId,
    initialMode = "manual",
    onCancel,
    onSuccess,
}: TimeEntryFormProps) {
    const isEdit = Boolean(entry);
    const router = useRouter();
    const [mode, setMode] = useState<"timer" | "manual">(isEdit ? "manual" : initialMode);
    const schema = useMemo(() => createTimeEntrySchema(isEdit), [isEdit]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TimeEntryFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            taskId: entry?.taskId ?? defaultTaskId ?? tasks[0]?.id ?? "",
            startTime: toDateTimeLocalInput(entry?.startTime),
            endTime: toDateTimeLocalInput(entry?.endTime),
            durationSeconds:
                entry && !entry.isRunning ? String(entry.durationSeconds) : "",
            description: entry?.description ?? "",
        },
    });

    const onSubmit = async (values: TimeEntryFormValues) => {
        const description = values.description?.trim() ? values.description.trim() : null;
        const isLive = !isEdit && mode === "timer";

        try {
            const response = entry
                ? await updateTimeEntry(entry.id, {
                      taskId: entry.taskId,
                      startTime: fromDateTimeLocalInput(values.startTime)!,
                      endTime: fromDateTimeLocalInput(values.endTime),
                      durationSeconds: values.durationSeconds?.trim()
                          ? Number(values.durationSeconds.trim())
                          : null,
                      description,
                  })
                : await createTimeEntry({
                      taskId: values.taskId,
                      startTime: isLive ? null : fromDateTimeLocalInput(values.startTime),
                      endTime: isLive ? null : fromDateTimeLocalInput(values.endTime),
                      durationSeconds: isLive || !values.durationSeconds?.trim()
                          ? null
                          : Number(values.durationSeconds.trim()),
                      description,
                  });

            if (!response.success) {
                notify.error(response.message || `Failed to ${isEdit ? "update" : "save"} time entry.`);
                return;
            }
            notify.success(response.message || `Time entry ${isEdit ? "updated" : isLive ? "started" : "logged"} successfully.`);
            onSuccess();
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 401) {
                logoutUser();
                notify.error("Session expired. Please sign in again.");
                router.replace("/login");
                return;
            }
            notify.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {!isEdit && (
                <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/40 p-1">
                    <button
                        type="button"
                        onClick={() => setMode("manual")}
                        className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                            mode === "manual" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <History className="size-3.5" />
                        Manual Past Entry
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode("timer")}
                        className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                            mode === "timer" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        <Clock className="size-3.5" />
                        Live Timer (Now)
                    </button>
                </div>
            )}

            <FormField id="entry-task" label="Task" error={errors.taskId?.message}>
                <select id="entry-task" disabled={isSubmitting || isEdit} className={SELECT_CLASS} {...register("taskId")}>
                    <option value="">Select a task</option>
                    {tasks.map((t) => (
                        <option key={t.id} value={t.id}>{t.title} ({t.status})</option>
                    ))}
                </select>
            </FormField>

            {(isEdit || mode === "manual") && (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField id="entry-start" label="Start Time (e.g. 3 days ago)" error={errors.startTime?.message}>
                            <Input id="entry-start" type="datetime-local" disabled={isSubmitting} aria-invalid={Boolean(errors.startTime)} {...register("startTime")} />
                        </FormField>
                        <FormField id="entry-end" label="End Time" error={errors.endTime?.message}>
                            <Input id="entry-end" type="datetime-local" disabled={isSubmitting} aria-invalid={Boolean(errors.endTime)} {...register("endTime")} />
                        </FormField>
                    </div>

                    <FormField id="entry-duration" label="Duration Seconds (Optional if Start/End given)" error={errors.durationSeconds?.message}>
                        <Input id="entry-duration" type="number" min="0" step="1" placeholder="10800 (3 hours)" disabled={isSubmitting} aria-invalid={Boolean(errors.durationSeconds)} {...register("durationSeconds")} />
                    </FormField>
                </>
            )}

            <FormField id="entry-description" label="Description / Work Notes" error={errors.description?.message}>
                <Textarea id="entry-description" placeholder="Summary of work completed..." maxLength={1000} disabled={isSubmitting} aria-invalid={Boolean(errors.description)} {...register("description")} />
            </FormField>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="cursor-pointer">Cancel</Button>
                <Button type="submit" disabled={isSubmitting || (!isEdit && tasks.length === 0)} className="cursor-pointer">
                    {isSubmitting ? (
                        <><Loader2 className="size-4 animate-spin" />{isEdit ? "Updating..." : "Saving..."}</>
                    ) : isEdit ? (
                        "Update Entry"
                    ) : mode === "timer" ? (
                        "Start Timer"
                    ) : (
                        "Log Completed Time"
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
}
