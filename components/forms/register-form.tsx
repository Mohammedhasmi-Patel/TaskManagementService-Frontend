"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";
import { PasswordInput } from "@/components/forms/password-input";
import { PasswordRequirements } from "@/components/forms/password-requirements";
import { notify } from "@/lib/toast";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";
import { registerUser } from "@/services/auth.service";

export function RegisterForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        },
    });

    const passwordValue = useWatch({
        control,
        name: "password",
        defaultValue: "",
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            const response = await registerUser(data);
            if (!response.success) {
                notify.error(response.message || "Registration failed.");
                return;
            }
            notify.success(response.message || "Account created successfully!");
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            notify.error(error);
        }
    };

    return (
        <Card className="w-full max-w-md border-border/80 shadow-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create an account</CardTitle>
                <CardDescription>
                    Enter your details below to register and start managing tasks.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    suppressHydrationWarning
                    className="space-y-4"
                >

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField
                            id="firstName"
                            label="First name"
                            error={errors.firstName?.message}
                        >
                            <Input
                                id="firstName"
                                type="text"
                                autoComplete="given-name"
                                placeholder="John"
                                maxLength={100}
                                disabled={isSubmitting}
                                aria-invalid={Boolean(errors.firstName)}
                                aria-describedby={errors.firstName ? "firstName-error" : undefined}
                                {...register("firstName")}
                            />
                        </FormField>

                        <FormField
                            id="lastName"
                            label="Last name"
                            error={errors.lastName?.message}
                        >
                            <Input
                                id="lastName"
                                type="text"
                                autoComplete="family-name"
                                placeholder="Doe"
                                maxLength={100}
                                disabled={isSubmitting}
                                aria-invalid={Boolean(errors.lastName)}
                                aria-describedby={errors.lastName ? "lastName-error" : undefined}
                                {...register("lastName")}
                            />
                        </FormField>
                    </div>

                    <FormField id="email" label="Email" error={errors.email?.message}>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="john.doe@example.com"
                            maxLength={256}
                            disabled={isSubmitting}
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={errors.email ? "email-error" : undefined}
                            {...register("email")}
                        />
                    </FormField>

                    <FormField
                        id="password"
                        label="Password"
                        error={errors.password?.message}
                    >
                        <PasswordInput
                            id="password"
                            autoComplete="new-password"
                            placeholder="Create a strong password"
                            disabled={isSubmitting}
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby="password-requirements"
                            {...register("password")}
                        />
                        <PasswordRequirements password={passwordValue} />
                    </FormField>

                    <Button type="submit" size="lg" className="w-full cursor-pointer" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <IconLoader2 className="size-4 animate-spin" />
                                Creating account...
                            </>
                        ) : (
                            "Create account"
                        )}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="justify-center border-t pt-4">
                <p className="text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
