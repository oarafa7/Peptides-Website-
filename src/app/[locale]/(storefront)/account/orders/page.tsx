import { getServerSession } from "next-auth";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { authOptions } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/data/account";
import { formatOrderNumber, formatPrice } from "@/lib/utils";

export default async function AccountOrdersPage() {
  const [session, t, locale] = await Promise.all([
    getServerSession(authOptions),
    getTranslations("Orders"),
    getLocale(),
  ]);
  const orders = session?.user?.id ? await getOrdersForUser(session.user.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("count", { count: orders.length })}</p>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noOrders")}</p>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("order")}</TableHead>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">{t("total")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link href={`/account/orders/${order.id}`} className="font-medium hover:underline">
                      {formatOrderNumber(order.id)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.createdAt.toLocaleDateString(locale)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatPrice(order.totalCents)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
