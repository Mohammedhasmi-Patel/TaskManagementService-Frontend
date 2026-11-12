"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, Cpu, FolderKanban, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { logoutUser } from "@/services/auth.service";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/companies", label: "Companies", icon: Building2 },
    { href: "/technologies", label: "Technologies", icon: Cpu },
    { href: "/projects", label: "Projects", icon: FolderKanban },
];

export function DashboardNavbar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        logoutUser();
        notify.success("Signed out successfully.");
        router.replace("/login");
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard"
                        className="text-base font-semibold tracking-tight"
                    >
                        TaskManagement
                    </Link>

                    <nav aria-label="Workspace navigation" className="flex items-center gap-1">
                        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                            const isActive =
                                pathname === href || pathname.startsWith(`${href}/`);
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <Icon className="size-4" />
                                    <span>{label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="cursor-pointer"
                >
                    <LogOut className="size-4" />
                    Sign out
                </Button>
            </div>
        </header>
    );
}

