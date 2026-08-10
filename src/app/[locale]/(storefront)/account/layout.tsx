import { getServerSession } from "next-auth";
import { getLocale, getTranslations } from "next-intl/server";

import { Link, redirect } from "@/i18n/navigation";
import { authOptions } from "@/lib/auth";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const [session, t, locale] = await Promise.all([
    getServerSession(authOptions),
    getTranslations("Account"),
    getLocale(),
  ]);

  if (!session?.user) {
    redirect({ href: { pathname: "/login", query: { callbackUrl: "/account" } }, locale });
    return null;
  }

  const NAV = [
    { href: "/account", label: t("overview") },
    { href: "/account/orders", label: t("orderHistory") },
    { href: "/account/addresses", label: t("addresses") },
  ];

  return (
    <div className="container-page grid grid-cols-1 gap-10 py-10 lg:grid-cols-[220px_1fr]">
      <aside>
        <p className="mb-4 text-sm font-semibold">
          {t("hiUser", { name: session.user.name ?? session.user.email ?? "" })}
        </p>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
