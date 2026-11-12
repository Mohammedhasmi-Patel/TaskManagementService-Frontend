"use client";

import { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { TechnologyForm } from "@/components/technologies/technology-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Technology } from "@/types/technology";

interface TechnologyDialogProps {
    technology?: Technology;
    onSaved: () => void;
}

export function TechnologyDialog({ technology, onSaved }: TechnologyDialogProps) {
    const [open, setOpen] = useState(false);
    const isEdit = Boolean(technology);

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
                        Add Technology
                    </>
                )}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {isEdit ? "Edit Technology" : "Create Technology"}
                        </DialogTitle>
                        <DialogDescription>
                            {isEdit
                                ? "Update the technology details or upload a new logo."
                                : "Add a new technology to tag across projects and tasks."}
                        </DialogDescription>
                    </DialogHeader>

                    {open && (
                        <TechnologyForm
                            technology={technology}
                            onCancel={() => setOpen(false)}
                            onSuccess={handleSuccess}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

