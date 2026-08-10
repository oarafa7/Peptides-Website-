import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package, Receipt, Tag, ExternalLink } from "lucide-react";

import { authOptions } from "@/lib/auth";
import { AdminSignOut } from "@/components/admin/sign-out-button";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: Receipt },
  { href: "/admin/coupons", label: "Discounts", icon: Tag },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-muted/20 lg:flex lg:flex-col">
        <div className="border-b p-6">
          <Link href="/admin" className="font-display text-lg font-semibold">
            PEPTIDE<span className="text-primary">LAB</span>
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">Admin Console</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t p-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" /> View store
          </Link>
          <p className="text-xs text-muted-foreground">{session.user.email}</p>
          <AdminSignOut />
        </div>
      </aside>
      <main className="flex-1 bg-background p-6 lg:p-10">{children}</main>
    </div>
  );
}
