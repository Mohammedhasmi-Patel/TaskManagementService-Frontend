"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { notify } from "@/lib/toast";
import { logoutUser } from "@/services/auth.service";
import { deleteProject } from "@/services/project.service";
import type { Project } from "@/types/project";

interface DeleteProjectDialogProps {
    project: Project;
    onDeleted: () => void;
}

export function DeleteProjectDialog({
    project,
    onDeleted,
}: DeleteProjectDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await deleteProject(project.id);
            if (!response.success) {
                notify.error(response.message || "Failed to delete project.");
                return;
            }
            notify.success(response.message || "Project deleted successfully.");
            setOpen(false);
            onDeleted();
        } catch (error) {
            if (isAxiosError(error) && error.response?.status === 401) {
                logoutUser();
                notify.error("Session expired. Please sign in again.");
                router.replace("/login");
                return;
            }
            notify.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setOpen(true)}
                className="cursor-pointer"
            >
                <Trash2 className="size-3.5" />
                Delete
            </Button>

            <Dialog open={open} onOpenChange={(next) => !isDeleting && setOpen(next)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Project</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-foreground">
                                {project.name}
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isDeleting}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => void handleDelete()}
                            disabled={isDeleting}
                            className="cursor-pointer"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete Project"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

