"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { ProjectForm } from "@/components/projects/project-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Company } from "@/types/company";
import type { Project } from "@/types/project";
import type { Technology } from "@/types/technology";

interface ProjectDialogProps {
    project?: Project;
    companies: Company[];
    technologies: Technology[];
    onSaved: () => void;
}

export function ProjectDialog({
    project,
    companies,
    technologies,
    onSaved,
}: ProjectDialogProps) {
    const [open, setOpen] = useState(false);
    const isEdit = Boolean(project);

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
                        Add Project
                    </>
                )}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? "Edit Project" : "Create Project"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? "Update project details, status, timeline, or technologies."
                                : "Create a new project under one of your companies."}
                        </DialogDescription>
                    </DialogHeader>

                    {open && (
                        <ProjectForm
                            project={project}
                            companies={companies}
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

