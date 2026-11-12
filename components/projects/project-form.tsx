"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/toast";
import { projectSchema, type ProjectFormValues } from "@/schemas/project.schema";
import { logoutUser } from "@/services/auth.service";
import { createProject, updateProject } from "@/services/project.service";
import type { Company } from "@/types/company";
import { PROJECT_STATUSES, type Project, type ProjectStatus } from "@/types/project";
import type { Technology } from "@/types/technology";
import { slugify } from "@/utils/slug";

interface ProjectFormProps {
    project?: Project;
    companies: Company[];
    technologies: Technology[];
    onCancel: () => void;
    onSuccess: () => void;
}

const SELECT_CLASS =
    "flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

export function ProjectForm({ project, companies, technologies, onCancel, onSuccess }: ProjectFormProps) {
    const isEdit = Boolean(project);
    const router = useRouter();
    const [slugEdited, setSlugEdited] = useState(isEdit);
    const defaultCompanyId = project?.companyId ?? companies.find((c) => c.isDefault)?.id ?? companies[0]?.id ?? "";
    const defaultStatus: ProjectStatus = PROJECT_STATUSES.includes(project?.status as ProjectStatus)
        ? (project!.status as ProjectStatus)
        : "Planned";

    const { register, handleSubmit, setValue, control, formState: { errors, isSubmitting } } =
        useForm<ProjectFormValues>({
            resolver: zodResolver(projectSchema),
            defaultValues: {
                companyId: defaultCompanyId,
                name: project?.name ?? "",
                slug: project?.slug ?? "",
                description: project?.description ?? "",
                status: defaultStatus,
                startDate: project?.startDate ?? "",
                endDate: project?.endDate ?? "",
                isActive: project?.isActive ?? true,
                technologyIds: project?.technologies.map((t) => t.id) ?? [],
            },
        });

    const selectedTechIds = useWatch({ control, name: "technologyIds" });
    const nameField = register("name");
    const slugField = register("slug");

    const onSubmit = async (values: ProjectFormValues) => {
        const basePayload = {
            companyId: values.companyId,
            name: values.name.trim(),
            slug: values.slug.trim(),
            description: values.description?.trim() ? values.description.trim() : null,
            status: values.status,
            startDate: values.startDate || null,
            endDate: values.endDate || null,
            technologyIds: values.technologyIds,
        };
        try {
            const response = project
                ? await updateProject(project.id, { ...basePayload, isActive: values.isActive })
                : await createProject(basePayload);
            if (!response.success) {
                notify.error(response.message || `Failed to ${isEdit ? "update" : "create"} project.`);
                return;
            }
            notify.success(response.message || `Project ${isEdit ? "updated" : "created"} successfully.`);
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
            <FormField id="project-company" label="Company" error={errors.companyId?.message}>
                <select id="project-company" disabled={isSubmitting} className={SELECT_CLASS} {...register("companyId")}>
                    <option value="">Select a company</option>
                    {companies.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </FormField>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField id="project-name" label="Name" error={errors.name?.message}>
                    <Input id="project-name" placeholder="Client Portal" maxLength={150} disabled={isSubmitting} aria-invalid={Boolean(errors.name)} {...nameField} onChange={(e) => {
                        void nameField.onChange(e);
                        if (!slugEdited) setValue("slug", slugify(e.target.value), { shouldValidate: Boolean(errors.slug) });
                    }} />
                </FormField>
                <FormField id="project-slug" label="Slug" error={errors.slug?.message}>
                    <Input id="project-slug" placeholder="client-portal" maxLength={180} disabled={isSubmitting} aria-invalid={Boolean(errors.slug)} {...slugField} onChange={(e) => {
                        setSlugEdited(true);
                        void slugField.onChange(e);
                    }} />
                </FormField>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField id="project-status" label="Status" error={errors.status?.message}>
                    <select id="project-status" disabled={isSubmitting} className={SELECT_CLASS} {...register("status")}>
                        {PROJECT_STATUSES.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                </FormField>
                <FormField id="project-start" label="Start Date" error={errors.startDate?.message}>
                    <Input id="project-start" type="date" disabled={isSubmitting} {...register("startDate")} />
                </FormField>
                <FormField id="project-end" label="End Date" error={errors.endDate?.message}>
                    <Input id="project-end" type="date" disabled={isSubmitting} aria-invalid={Boolean(errors.endDate)} {...register("endDate")} />
                </FormField>
            </div>
            <FormField id="project-description" label="Description" error={errors.description?.message}>
                <Textarea id="project-description" placeholder="Project scope and goals..." maxLength={2000} disabled={isSubmitting} aria-invalid={Boolean(errors.description)} {...register("description")} />
            </FormField>
            <FormField id="project-technologies" label="Technologies" error={errors.technologyIds?.message}>
                <TechnologyPicker technologies={technologies} selectedIds={selectedTechIds} onChange={(ids) => setValue("technologyIds", ids)} disabled={isSubmitting} />
            </FormField>
            {isEdit && (
                <div className="flex items-center gap-2 pt-1">
                    <input id="project-is-active" type="checkbox" disabled={isSubmitting} className="size-4 cursor-pointer rounded border-input accent-primary" {...register("isActive")} />
                    <Label htmlFor="project-is-active" className="cursor-pointer font-normal">Active project</Label>
                </div>
            )}
            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="cursor-pointer">Cancel</Button>
                <Button type="submit" disabled={isSubmitting || companies.length === 0} className="cursor-pointer">
                    {isSubmitting ? (<><Loader2 className="size-4 animate-spin" />{isEdit ? "Updating..." : "Creating..."}</>) : isEdit ? "Update Project" : "Create Project"}
                </Button>
            </DialogFooter>
        </form>
    );
}

