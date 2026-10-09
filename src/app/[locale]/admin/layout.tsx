import { getServerSession } from "next-auth";
import { getLocale } from "next-intl/server";

import { authOptions } from "@/lib/auth";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/admin-nav";
import { redirect } from "@/i18n/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const [session, locale] = await Promise.all([getServerSession(authOptions), getLocale()]);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect({ href: { pathname: "/login", query: { callbackUrl: "/admin" } }, locale });
    return null;
  }

  const email = session.user.email ?? "";

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminMobileNav email={email} />
      <AdminSidebar email={email} />
      <main className="min-w-0 flex-1 bg-background p-4 sm:p-6 lg:p-10">{children}</main>
    </div>
  );
}
