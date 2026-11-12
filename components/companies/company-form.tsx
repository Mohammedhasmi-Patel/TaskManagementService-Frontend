"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Loader2, X } from "lucide-react";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/toast";
import { companySchema, type CompanyFormValues } from "@/schemas/company.schema";
import { logoutUser } from "@/services/auth.service";
import { createCompany, updateCompany } from "@/services/company.service";
import type { Company } from "@/types/company";
import { slugify } from "@/utils/slug";

interface CompanyFormProps {
    company?: Company;
    onCancel: () => void;
    onSuccess: () => void;
}

export function CompanyForm({ company, onCancel, onSuccess }: CompanyFormProps) {
    const isEdit = Boolean(company);
    const router = useRouter();
    const [slugEdited, setSlugEdited] = useState(isEdit);
    const [fileInputKey, setFileInputKey] = useState(0);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<CompanyFormValues>({
        resolver: zodResolver(companySchema),
        defaultValues: {
            name: company?.name ?? "",
            slug: company?.slug ?? "",
            website: company?.website ?? "",
            description: company?.description ?? "",
            isDefault: company?.isDefault ?? false,
            logo: undefined,
        },
    });

    const selectedLogo = useWatch({ control, name: "logo" });
    const nameField = register("name");
    const slugField = register("slug");

    const clearLogo = () => {
        setValue("logo", undefined, { shouldValidate: true });
        setFileInputKey((prev) => prev + 1);
    };

    const onSubmit = async (values: CompanyFormValues) => {
        try {
            const response = company
                ? await updateCompany(company.id, values)
                : await createCompany(values);
            if (!response.success) {
                notify.error(
                    response.message || `Failed to ${isEdit ? "update" : "create"} company.`
                );
                return;
            }
            notify.success(
                response.message || `Company ${isEdit ? "updated" : "created"} successfully.`
            );
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
            <FormField id="company-name" label="Name" error={errors.name?.message}>
                <Input
                    id="company-name"
                    placeholder="Netizens Technology"
                    maxLength={150}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.name)}
                    {...nameField}
                    onChange={(e) => {
                        void nameField.onChange(e);
                        if (!slugEdited) {
                            setValue("slug", slugify(e.target.value), {
                                shouldValidate: Boolean(errors.slug),
                            });
                        }
                    }}
                />
            </FormField>

            <FormField id="company-slug" label="Slug" error={errors.slug?.message}>
                <Input
                    id="company-slug"
                    placeholder="netizens-technology"
                    maxLength={180}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.slug)}
                    {...slugField}
                    onChange={(e) => {
                        setSlugEdited(true);
                        void slugField.onChange(e);
                    }}
                />
            </FormField>

            <FormField id="company-website" label="Website" error={errors.website?.message}>
                <Input
                    id="company-website"
                    type="url"
                    placeholder="https://example.com"
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.website)}
                    {...register("website")}
                />
            </FormField>

            <FormField id="company-description" label="Description" error={errors.description?.message}>
                <Textarea
                    id="company-description"
                    placeholder="Brief description of the company..."
                    maxLength={1000}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.description)}
                    {...register("description")}
                />
            </FormField>

            <FormField id="company-logo" label="Logo (JPG, JPEG, PNG, WEBP — max 2 MB)" error={errors.logo?.message}>
                <div className="flex items-center gap-2">
                    <Input
                        key={fileInputKey}
                        id="company-logo"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        disabled={isSubmitting}
                        aria-invalid={Boolean(errors.logo)}
                        onChange={(e) => {
                            setValue("logo", e.target.files?.[0], { shouldValidate: true });
                        }}
                    />
                    {selectedLogo && (
                        <Button type="button" variant="ghost" size="icon" onClick={clearLogo} aria-label="Remove logo" className="cursor-pointer">
                            <X className="size-4" />
                        </Button>
                    )}
                </div>
            </FormField>

            <div className="flex items-center gap-2 pt-1">
                <input
                    id="company-is-default"
                    type="checkbox"
                    disabled={isSubmitting}
                    className="size-4 cursor-pointer rounded border-input accent-primary"
                    {...register("isDefault")}
                />
                <Label htmlFor="company-is-default" className="cursor-pointer font-normal">
                    Set as default company
                </Label>
            </div>

            <DialogFooter>
                <Button className="cursor-pointer" type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            {isEdit ? "Updating..." : "Creating..."}
                        </>
                    ) : isEdit ? (
                        "Update Company"
                    ) : (
                        "Create Company"
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
}

