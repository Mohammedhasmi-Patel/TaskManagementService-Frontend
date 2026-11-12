"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { notify } from "@/lib/toast";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";
import { loginUser } from "@/services/auth.service";

export function LoginForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const response = await loginUser(data);
            if (!response.success) {
                notify.error(response.message || "Login failed.");
                return;
            }
            notify.success(response.message || "Logged in successfully!");
            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            notify.error(error);
        }
    };

    return (
        <Card className="w-full max-w-md border-border/80 shadow-md">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>
                    Enter your credentials below to sign in to your account.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    suppressHydrationWarning
                    className="space-y-4"
                >
                    <FormField id="email" label="Email" error={errors.email?.message}>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="john.doe@example.com"
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
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            disabled={isSubmitting}
                            aria-invalid={Boolean(errors.password)}
                            aria-describedby={errors.password ? "password-error" : undefined}
                            {...register("password")}
                        />
                    </FormField>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full cursor-pointer"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <IconLoader2 className="size-4 animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </Button>
                </form>
            </CardContent>

            <CardFooter className="justify-center border-t pt-4">
                <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                        Create account
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}

