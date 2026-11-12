"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CompanyForm } from "@/components/companies/company-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface CreateCompanyDialogProps {
    onCreated: () => void;
}

export function CreateCompanyDialog({ onCreated }: CreateCompanyDialogProps) {
    const [open, setOpen] = useState(false);

    const handleSuccess = () => {
        setOpen(false);
        onCreated();
    };

    return (
        <>
            <Button type="button" onClick={() => setOpen(true)} className="cursor-pointer">
                <Plus className="size-4" />
                Add Company
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create Company</DialogTitle>
                        <DialogDescription>
                            Add a new company to organize your projects and tasks.
                        </DialogDescription>
                    </DialogHeader>

                    {open && (
                        <CompanyForm
                            onCancel={() => setOpen(false)}
                            onSuccess={handleSuccess}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
