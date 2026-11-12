"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { CompanyForm } from "@/components/companies/company-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Company } from "@/types/company";

interface EditCompanyDialogProps {
    company: Company;
    onUpdated: () => void;
    size?: "sm" | "default";
}

export function EditCompanyDialog({
    company,
    onUpdated,
    size = "sm",
}: EditCompanyDialogProps) {
    const [open, setOpen] = useState(false);

    const handleSuccess = () => {
        setOpen(false);
        onUpdated();
    };

    return (
        <>
            <Button
                type="button"
                variant="outline"
                size={size}
                onClick={() => setOpen(true)}
                className="cursor-pointer"
            >
                <Pencil className="size-3.5" />
                Edit
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Company</DialogTitle>
                        <DialogDescription>
                            Update the company details or upload a new logo.
                        </DialogDescription>
                    </DialogHeader>

                    {open && (
                        <CompanyForm
                            company={company}
                            onCancel={() => setOpen(false)}
                            onSuccess={handleSuccess}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

