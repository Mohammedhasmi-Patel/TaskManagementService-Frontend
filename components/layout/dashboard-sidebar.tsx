"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    Building2,
    CheckSquare,
    Clock,
    Cpu,
    FolderKanban,
    LayoutDashboard,
    ListTodo,
    LogOut,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/toast";
import { logoutUser } from "@/services/auth.service";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/companies", label: "Companies", icon: Building2 },
    { href: "/technologies", label: "Technologies", icon: Cpu },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/tasks", label: "Tasks", icon: ListTodo },
    { href: "/time-entries", label: "Time Entries", icon: Clock },
];

interface DashboardSidebarProps {
    onNavigate?: () => void;
    className?: string;
}

export function DashboardSidebar({
    onNavigate,
    className,
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        logoutUser();
        notify.success("Signed out successfully.");
        onNavigate?.();
        router.replace("/login");
        router.refresh();
    };

    return (
        <aside
            className={cn(
                "flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
                className
            )}
        >
            <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <CheckSquare className="size-4" />
                </div>
                <Link
                    href="/dashboard"
                    onClick={onNavigate}
                    className="text-base font-semibold tracking-tight"
                >
                    TaskManagement
                </Link>
            </div>

            <nav
                aria-label="Sidebar navigation"
                className="flex-1 space-y-1 p-3"
            >
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const isActive =
                        pathname === href || pathname.startsWith(`${href}/`);
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onNavigate}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-xs"
                                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                            )}
                        >
                            <Icon className="size-4 shrink-0" />
                            <span>{label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="border-t border-sidebar-border p-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full cursor-pointer justify-start gap-2"
                >
                    <LogOut className="size-4" />
                    Sign out
                </Button>
            </div>
        </aside>
    );
}

