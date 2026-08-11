"use client";

import { useSession, signOut } from "next-auth/react";
import { Heart, Menu, ShoppingBag, User } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchDialog } from "@/components/shared/search-dialog";
import { CartTriggerBadge } from "@/components/shared/cart-drawer";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { Logo } from "@/components/shared/logo";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import { cn } from "@/lib/utils";

export function Header() {
  const { data: session } = useSession();
  const openCart = useCart((s) => s.open);
  const wishlistCount = useWishlist((s) => s.productIds.length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("Nav");

  const NAV_LINKS = [
    { href: "/shop", label: t("shopAll") },
    { href: "/collections/metabolic", label: t("metabolic") },
    { href: "/collections/recovery-repair", label: t("recovery") },
    { href: "/collections/longevity", label: t("longevity") },
    { href: "/about", label: t("about") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            className="me-1 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={t("menu")}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo textClassName="hidden sm:inline text-lg" />
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchDialog />

          <LanguageSwitcher />

          <Button variant="ghost" size="icon" asChild aria-label={t("wishlist")} className="relative">
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -end-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("account")}>
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {session?.user ? (
                <>
                  <DropdownMenuLabel>{session.user.name ?? session.user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">{t("myAccount")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">{t("orderHistory")}</Link>
                  </DropdownMenuItem>
                  {session.user.role === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">{t("adminDashboard")}</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                    {t("signOut")}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">{t("signIn")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup">{t("createAccount")}</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" aria-label={t("cart")} className="relative" onClick={openCart}>
            <ShoppingBag className="h-5 w-5" />
            <CartTriggerBadge />
          </Button>
        </div>
      </div>

      <nav
        className={cn(
          "flex-col gap-1 border-t bg-background px-4 py-3 lg:hidden",
          mobileOpen ? "flex" : "hidden"
        )}
      >
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-2 py-2 text-sm font-medium hover:bg-accent"
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
