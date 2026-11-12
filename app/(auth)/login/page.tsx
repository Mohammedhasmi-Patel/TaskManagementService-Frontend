import type { Metadata } from "next";
import { LoginForm } from "@/components/forms/login-form";

export const metadata: Metadata = {
    title: "Login | Task Management",
    description: "Sign in to your account to manage your tasks.",
};

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
            <LoginForm />
        </main>
    );
}

