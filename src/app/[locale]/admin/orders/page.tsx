import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { getAllOrders } from "@/lib/data/admin";
import { formatOrderNumber, formatPrice } from "@/lib/utils";
import { OrderStatusFilter } from "@/components/admin/order-status-filter";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "success" | "destructive"> = {
  PENDING: "secondary",
  PAID: "default",
  UNFULFILLED: "secondary",
  FULFILLED: "success",
  SHIPPED: "success",
  DELIVERED: "success",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const [orders, t, locale] = await Promise.all([
    getAllOrders(searchParams.status),
    getTranslations("AdminOrders"),
    getLocale(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("count", { count: orders.length })}</p>
        </div>
        <OrderStatusFilter current={searchParams.status} />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("colOrder")}</TableHead>
              <TableHead>{t("colEmail")}</TableHead>
              <TableHead>{t("colStatus")}</TableHead>
              <TableHead>{t("colItems")}</TableHead>
              <TableHead className="text-right">{t("colTotal")}</TableHead>
              <TableHead className="text-right">{t("colDate")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                    {formatOrderNumber(order.id)}
                  </Link>
                </TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[order.status] ?? "secondary"}>{order.status}</Badge>
                </TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell className="text-right">{formatPrice(order.totalCents)}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {order.createdAt.toLocaleDateString(locale)}
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                  {t("noOrders")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
