import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/storefront/profile-form";
import { Link } from "@/i18n/navigation";
import { authOptions } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/data/account";
import { formatOrderNumber, formatPrice } from "@/lib/utils";

export default async function AccountOverviewPage() {
  const [session, t] = await Promise.all([getServerSession(authOptions), getTranslations("Account")]);
  const orders = session?.user?.id ? await getOrdersForUser(session.user.id) : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t("myAccount")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("profile")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm name={session?.user?.name ?? ""} email={session?.user?.email ?? ""} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("recentOrders")}</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/account/orders">{t("viewAll")}</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("noOrders")}</p>
          ) : (
            <ul className="divide-y">
              {orders.slice(0, 3).map((order) => (
                <li key={order.id} className="flex items-center justify-between py-3 text-sm">
                  <Link href={`/account/orders/${order.id}`} className="font-medium hover:underline">
                    {formatOrderNumber(order.id)}
                  </Link>
                  <span className="text-muted-foreground">{order.status}</span>
                  <span className="font-medium">{formatPrice(order.totalCents)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
