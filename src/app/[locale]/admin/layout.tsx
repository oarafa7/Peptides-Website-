import { getServerSession } from "next-auth";
import { LayoutDashboard, Layers, Package, Receipt, Tag, ExternalLink } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { authOptions } from "@/lib/auth";
import { AdminSignOut } from "@/components/admin/sign-out-button";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { Link, redirect } from "@/i18n/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, t, locale] = await Promise.all([
    getServerSession(authOptions),
    getTranslations("Admin"),
    getLocale(),
  ]);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect({ href: { pathname: "/login", query: { callbackUrl: "/admin" } }, locale });
    return null;
  }

  const NAV = [
    { href: "/admin", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/admin/products", label: t("products"), icon: Package },
    { href: "/admin/categories", label: t("categories"), icon: Layers },
    { href: "/admin/orders", label: t("orders"), icon: Receipt },
    { href: "/admin/coupons", label: t("discounts"), icon: Tag },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r bg-muted/20 lg:flex lg:flex-col">
        <div className="border-b p-6">
          <div className="flex items-center justify-between gap-2">
            <Logo imgClassName="h-8" textClassName="text-sm leading-tight" />
            <LanguageSwitcher />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{t("consoleLabel")}</p>
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
            <ExternalLink className="h-4 w-4" /> {t("viewStore")}
          </Link>
          <p className="text-xs text-muted-foreground">{session.user.email}</p>
          <AdminSignOut />
        </div>
      </aside>
      <main className="flex-1 bg-background p-6 lg:p-10">{children}</main>
    </div>
  );
}
