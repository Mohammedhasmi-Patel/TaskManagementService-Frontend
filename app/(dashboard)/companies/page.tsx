import { Suspense } from "react";
import type { Metadata } from "next";
import { CompaniesList } from "@/components/companies/companies-list";

export const metadata: Metadata = {
    title: "Companies | Task Management",
    description: "View and manage your workspace companies.",
};

export default function CompaniesPage() {
    return (
        <Suspense>
            <CompaniesList />
        </Suspense>
    );
}
