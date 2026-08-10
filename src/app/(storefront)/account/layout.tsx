import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

const NAV = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Order History" },
  { href: "/account/addresses", label: "Addresses" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/account");

  return (
    <div className="container-page grid grid-cols-1 gap-10 py-10 lg:grid-cols-[220px_1fr]">
      <aside>
        <p className="mb-4 text-sm font-semibold">Hi, {session.user.name ?? session.user.email}</p>
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
