"use client";

import { useState } from "react";
import { LayoutDashboard, Layers, Menu, Package, Receipt, Tag, ExternalLink, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { AdminSignOut } from "@/components/admin/sign-out-button";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("Admin");
  const pathname = usePathname();

  const NAV = [
    { href: "/admin", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/admin/products", label: t("products"), icon: Package },
    { href: "/admin/categories", label: t("categories"), icon: Layers },
    { href: "/admin/orders", label: t("orders"), icon: Receipt },
    { href: "/admin/coupons", label: t("discounts"), icon: Tag },
  ];

  return (
    <>
      {NAV.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground",
              active && "bg-accent text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

function NavFooter({ email, onNavigate }: { email: string; onNavigate?: () => void }) {
  const t = useTranslations("Admin");
  return (
    <div className="space-y-2">
      <Link
        href="/"
        onClick={onNavigate}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ExternalLink className="h-4 w-4" /> {t("viewStore")}
      </Link>
      <p className="break-all text-xs text-muted-foreground">{email}</p>
      <AdminSignOut />
    </div>
  );
}

export function AdminSidebar({ email }: { email: string }) {
  const t = useTranslations("Admin");
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-e bg-muted/20 lg:flex lg:flex-col">
      <div className="border-b p-6">
        <div className="flex items-center justify-between gap-2">
          <Logo imgClassName="h-8" textClassName="text-sm leading-tight" />
          <LanguageSwitcher />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{t("consoleLabel")}</p>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        <NavLinks />
      </nav>
      <div className="border-t p-4">
        <NavFooter email={email} />
      </div>
    </aside>
  );
}

export function AdminMobileNav({ email }: { email: string }) {
  const t = useTranslations("Admin");
  const tNav = useTranslations("Nav");
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
      <div className="flex h-14 items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            className="-ms-1 rounded-md p-1.5 hover:bg-accent"
            onClick={() => setOpen((o) => !o)}
            aria-label={tNav("menu")}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Logo imgClassName="h-7" showText={false} />
          <span className="truncate text-sm font-medium text-muted-foreground">{t("consoleLabel")}</span>
        </div>
        <LanguageSwitcher />
      </div>
      {open && (
        <div className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t bg-background px-4 py-3">
          <nav className="space-y-1">
            <NavLinks onNavigate={close} />
          </nav>
          <div className="mt-3 border-t pt-3">
            <NavFooter email={email} onNavigate={close} />
          </div>
        </div>
      )}
    </header>
  );
}
