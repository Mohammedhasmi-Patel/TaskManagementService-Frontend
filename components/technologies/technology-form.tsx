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
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/toast";
import {
    technologySchema,
    type TechnologyFormValues,
} from "@/schemas/technology.schema";
import { logoutUser } from "@/services/auth.service";
import {
    createTechnology,
    updateTechnology,
} from "@/services/technology.service";
import type { Technology } from "@/types/technology";
import { slugify } from "@/utils/slug";

interface TechnologyFormProps {
    technology?: Technology;
    onCancel: () => void;
    onSuccess: () => void;
}

export function TechnologyForm({
    technology,
    onCancel,
    onSuccess,
}: TechnologyFormProps) {
    const isEdit = Boolean(technology);
    const router = useRouter();
    const [slugEdited, setSlugEdited] = useState(isEdit);
    const [fileInputKey, setFileInputKey] = useState(0);

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors, isSubmitting },
    } = useForm<TechnologyFormValues>({
        resolver: zodResolver(technologySchema),
        defaultValues: {
            name: technology?.name ?? "",
            slug: technology?.slug ?? "",
            description: technology?.description ?? "",
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

    const onSubmit = async (values: TechnologyFormValues) => {
        try {
            const response = technology
                ? await updateTechnology(technology.id, values)
                : await createTechnology(values);
            if (!response.success) {
                notify.error(
                    response.message || `Failed to ${isEdit ? "update" : "create"} technology.`
                );
                return;
            }
            notify.success(
                response.message || `Technology ${isEdit ? "updated" : "created"} successfully.`
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
            <FormField id="technology-name" label="Name" error={errors.name?.message}>
                <Input
                    id="technology-name"
                    placeholder="TypeScript"
                    maxLength={100}
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

            <FormField id="technology-slug" label="Slug" error={errors.slug?.message}>
                <Input
                    id="technology-slug"
                    placeholder="typescript"
                    maxLength={120}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.slug)}
                    {...slugField}
                    onChange={(e) => {
                        setSlugEdited(true);
                        void slugField.onChange(e);
                    }}
                />
            </FormField>

            <FormField id="technology-description" label="Description" error={errors.description?.message}>
                <Textarea
                    id="technology-description"
                    placeholder="Brief description of the technology..."
                    maxLength={1000}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.description)}
                    {...register("description")}
                />
            </FormField>

            <FormField id="technology-logo" label="Logo (JPG, JPEG, PNG, WEBP — max 2 MB)" error={errors.logo?.message}>
                <div className="flex items-center gap-2">
                    <Input
                        key={fileInputKey}
                        id="technology-logo"
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

            <DialogFooter>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} className="cursor-pointer">
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="size-4 animate-spin" />
                            {isEdit ? "Updating..." : "Creating..."}
                        </>
                    ) : isEdit ? (
                        "Update Technology"
                    ) : (
                        "Create Technology"
                    )}
                </Button>
            </DialogFooter>
        </form>
    );
}

