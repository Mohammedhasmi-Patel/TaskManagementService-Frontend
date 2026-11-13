"use client";

import { Suspense, useState, type ReactNode } from "react";
import Link from "next/link";
import { CheckSquare, Menu, X } from "lucide-react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { Button } from "@/components/ui/button";

export function DashboardShell({ children }: { children: ReactNode }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-muted/20">
            <div className="hidden md:block">
                <div className="sticky top-0 h-screen">
                    <Suspense fallback={<div className="h-full w-64 border-r border-sidebar-border bg-sidebar" />}>
                        <DashboardSidebar />
                    </Suspense>
                </div>
            </div>

            {mobileOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
                        onClick={() => setMobileOpen(false)}
                    />
                    <div className="relative z-10 h-full">
                        <Suspense fallback={<div className="h-full w-64 border-r border-sidebar-border bg-sidebar" />}>
                            <DashboardSidebar onNavigate={() => setMobileOpen(false)} />
                        </Suspense>
                    </div>
                </div>
            )}

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:hidden">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2 text-base font-semibold tracking-tight"
                    >
                        <CheckSquare className="size-4 text-primary" />
                        <span>TaskManagement</span>
                    </Link>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        className="cursor-pointer"
                    >
                        {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                    </Button>
                </header>

                <div className="flex-1">{children}</div>
            </div>
        </div>
    );
}

