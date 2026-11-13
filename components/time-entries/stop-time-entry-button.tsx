"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { Loader2, Square } from "lucide-react";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { notify } from "@/lib/toast";
import { logoutUser } from "@/services/auth.service";
import { stopTimeEntry } from "@/services/time-entry.service";

interface StopTimeEntryButtonProps {
    id: string;
    currentDescription?: string | null;
    onStopped: () => void;
}

export function StopTimeEntryButton({
    id,
    currentDescription,
    onStopped,
}: StopTimeEntryButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState(currentDescription ?? "");
    const [error, setError] = useState<string | undefined>();
    const [isStopping, setIsStopping] = useState(false);

    const handleOpen = () => {
        setDescription(currentDescription ?? "");
        setError(undefined);
        setOpen(true);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const trimmed = description.trim();
        if (trimmed.length > 1000) {
            setError("Description must not exceed 1000 characters.");
            return;
        }

        setIsStopping(true);
        setError(undefined);
        try {
            const response = await stopTimeEntry(id, {
                description: trimmed ? trimmed : null,
            });
            if (!response.success) {
                notify.error(response.message || "Failed to stop timer.");
                return;
            }
            notify.success(response.message || "Time entry stopped.");
            setOpen(false);
            onStopped();
        } catch (err) {
            if (isAxiosError(err) && err.response?.status === 401) {
                logoutUser();
                notify.error("Session expired. Please sign in again.");
                router.replace("/login");
                return;
            }
            notify.error(err);
        } finally {
            setIsStopping(false);
        }
    };

    return (
        <>
            <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleOpen}
                className="cursor-pointer"
            >
                <Square className="size-3 fill-current" />
                Stop
            </Button>

            <Dialog open={open} onOpenChange={(next) => !isStopping && setOpen(next)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Stop Time Entry</DialogTitle>
                        <DialogDescription>
                            Add a note about what you completed or why you are stopping.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} noValidate className="space-y-4">
                        <FormField id={`stop-desc-${id}`} label="Description" error={error}>
                            <Textarea
                                id={`stop-desc-${id}`}
                                placeholder="e.g. Completed API validation, pausing for review..."
                                maxLength={1000}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                disabled={isStopping}
                            />
                        </FormField>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isStopping}
                                className="cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isStopping}
                                className="cursor-pointer"
                            >
                                {isStopping ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Stopping...
                                    </>
                                ) : (
                                    "Stop Timer"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
