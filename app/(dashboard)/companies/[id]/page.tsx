import { Suspense } from "react";
import type { Metadata } from "next";
import { CompanyDetails } from "@/components/companies/company-details";

export const metadata: Metadata = {
    title: "Company Details | Task Management",
    description: "View details for a workspace company.",
};

export default function CompanyDetailPage() {
    return (
        <Suspense>
            <CompanyDetails />
        </Suspense>
    );
}

