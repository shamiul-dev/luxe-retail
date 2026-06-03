"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ArrowLeft,
  Tags,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface AdminSidebarProps {
  user: { name: string; email: string; role?: string };
}

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const initials = user.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <aside className="w-52 shrink-0 bg-white border-r border-border flex flex-col min-h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <p className="font-heading font-bold text-sm tracking-widest text-primary uppercase">
          Admin Panel
        </p>
        <p className="text-[10px] text-content-muted mt-0.5 tracking-widest uppercase">
          Store Management
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-white"
                  : "text-content-secondary hover:bg-surface-container hover:text-content",
              )}
            >
              <Icon size={17} strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      {/* Back to store */}
      <div className="px-3 py-2 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-content-secondary hover:bg-surface-container hover:text-content transition-colors"
        >
          <ArrowLeft size={17} /> Back to Store
        </Link>
      </div>

      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-white">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-content truncate">
              {user.name}
            </p>
            <p className="text-[10px] text-content-muted uppercase tracking-wide">
              {user.role ?? "Administrator"}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-content-secondary hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer w-full mt-1"
        >
          <LogOut size={17} /> Sign Out
        </button>
      </div>
    </aside>
  );
}
