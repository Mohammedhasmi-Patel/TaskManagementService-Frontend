import type { Metadata } from "next";
import { RegisterForm } from "@/components/forms/register-form";

export const metadata: Metadata = {
    title: "Register | Task Management",
    description: "Create a new account to start managing your tasks.",
};

export default function RegisterPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
            <RegisterForm />
        </main>
    );
}

