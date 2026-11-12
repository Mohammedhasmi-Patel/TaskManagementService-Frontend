import type { ReactNode } from "react";
import { DashboardNavbar } from "@/components/layout/dashboard-navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col bg-muted/20">
            <DashboardNavbar />
            <div className="flex-1">{children}</div>
        </div>
    );
}

