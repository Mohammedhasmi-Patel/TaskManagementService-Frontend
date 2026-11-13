"use client";

import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { FormField } from "@/components/forms/form-field";
import { TechnologyPicker } from "@/components/projects/technology-picker";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/toast";
import { taskSchema, type TaskFormValues } from "@/schemas/task.schema";
import { logoutUser } from "@/services/auth.service";
import { createTask, updateTask } from "@/services/task.service";
import type { Project } from "@/types/project";
import {
    TASK_PRIORITIES,
    TASK_STATUSES,
    type Task,
    type TaskPriority,
    type TaskStatus,
} from "@/types/task";
import type { Technology } from "@/types/technology";

interface TaskFormProps {
    task?: Task;
    projects: Project[];
    technologies: Technology[];
    onCancel: () => void;
    onSuccess: () => void;
}

const SELECT_CLASS =
    "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

export function TaskForm({ task, projects, technologies, onCancel, onSuccess }: TaskFormProps) {
    const isEdit = Boolean(task);
    const router = useRouter();
    const defaultStatus: TaskStatus = TASK_STATUSES.includes(task?.status as TaskStatus)
        ? (task!.status as TaskStatus)
        : "Todo";
    const defaultPriority: TaskPriority = TASK_PRIORITIES.includes(task?.priority as TaskPriority)
        ? (task!.priority as TaskPriority)
        : "Medium";

    const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } =
        useForm<TaskFormValues>({
            resolver: zodResolver(taskSchema),
            defaultValues: {
                projectId: task?.projectId ?? projects[0]?.id ?? "",
                title: task?.title ?? "",
                description: task?.description ?? "",
                status: defaultStatus,
                priority: defaultPriority,
                estimatedHours: task?.estimatedHours != null ? String(task.estimatedHours) : "",
                technologyIds: task?.technologies.map((t) => t.id) ?? [],
            },
        });

    const selectedTechIds = useWatch({ control, name: "technologyIds" });
    const selectedStatus = useWatch({ control, name: "status" });
    const isTodo = selectedStatus === "Todo";
    const isCompleted = selectedStatus === "Completed";
    const allowHoursInput = isTodo || isCompleted;

    const onSubmit = async (values: TaskFormValues) => {
        const hoursText = values.estimatedHours?.trim();
        const estimatedHours = allowHoursInput
            ? (hoursText ? Number(hoursText) : null)
            : (task?.estimatedHours ?? null);
        const payload = {
            projectId: values.projectId,
            title: values.title.trim(),
            description: values.description?.trim() ? values.description.trim() : null,
            status: values.status,
            priority: values.priority,
            estimatedHours,
            technologyIds: values.technologyIds,
        };
        try {
            const response = task ? await updateTask(task.id, payload) : await createTask(payload);
            if (!response.success) {
                notify.error(response.message || `Failed to ${isEdit ? "update" : "create"} task.`);
                return;
            }
            notify.success(response.message || `Task ${isEdit ? "updated" : "created"} successfully.`);
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
            <FormField id="task-project" label="Project" error={errors.projectId?.message}>
                <select id="task-project" disabled={isSubmitting} className={SELECT_CLASS} {...register("projectId")}>
                    <option value="">Select a project</option>
                    {projects.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </FormField>

            <FormField id="task-title" label="Title" error={errors.title?.message}>
                <Input id="task-title" placeholder="Implement task filtering" maxLength={200} disabled={isSubmitting} aria-invalid={Boolean(errors.title)} {...register("title")} />
            </FormField>

            {allowHoursInput ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <FormField id="task-status" label="Status" error={errors.status?.message}>
                        <select id="task-status" disabled={isSubmitting} className={SELECT_CLASS} {...register("status")}>
                            {TASK_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                        </select>
                    </FormField>
                    <FormField id="task-priority" label="Priority" error={errors.priority?.message}>
                        <select id="task-priority" disabled={isSubmitting} className={SELECT_CLASS} {...register("priority")}>
                            {TASK_PRIORITIES.map((p) => (<option key={p} value={p}>{p}</option>))}
                        </select>
                    </FormField>
                    <FormField id="task-hours" label={isCompleted ? "Completed Hours" : "Est. Hours (Plan)"} error={errors.estimatedHours?.message}>
                        <Input id="task-hours" type="number" step="0.25" min="0" placeholder={isCompleted ? "3.5" : "4.5"} disabled={isSubmitting} aria-invalid={Boolean(errors.estimatedHours)} {...register("estimatedHours")} />
                    </FormField>
                </div>
            ) : (
                <div className="space-y-2">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField id="task-status" label="Status" error={errors.status?.message}>
                            <select id="task-status" disabled={isSubmitting} className={SELECT_CLASS} {...register("status")}>
                                {TASK_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                            </select>
                        </FormField>
                        <FormField id="task-priority" label="Priority" error={errors.priority?.message}>
                            <select id="task-priority" disabled={isSubmitting} className={SELECT_CLASS} {...register("priority")}>
                                {TASK_PRIORITIES.map((p) => (<option key={p} value={p}>{p}</option>))}
                            </select>
                        </FormField>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {selectedStatus === "InProgress"
                            ? "Hours are automatically tracked via the timer while In Progress."
                            : task?.estimatedHours != null
                                ? `Planned estimate: ${task.estimatedHours}h (actual hours tracked automatically).`
                                : "Estimation is only applicable during planning (Todo) or when completed."}
                    </p>
                </div>
            )}

            <FormField id="task-description" label="Description" error={errors.description?.message}>
                <Textarea id="task-description" placeholder="Acceptance criteria and implementation notes..." maxLength={2000} disabled={isSubmitting} aria-invalid={Boolean(errors.description)} {...register("description")} />
            </FormField>

            <FormField id="task-technologies" label="Technologies" error={errors.technologyIds?.message}>
                <TechnologyPicker technologies={technologies} selectedIds={selectedTechIds} onChange={(ids) => setValue("technologyIds", ids)} disabled={isSubmitting} />
            </FormField>

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="cursor-pointer">Cancel</Button>
                <Button type="submit" disabled={isSubmitting || projects.length === 0} className="cursor-pointer">
                    {isSubmitting ? (<><Loader2 className="size-4 animate-spin" />{isEdit ? "Updating..." : "Creating..."}</>) : isEdit ? "Update Task" : "Create Task"}
                </Button>
            </DialogFooter>
        </form>
    );
}

