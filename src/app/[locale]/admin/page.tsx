import { DollarSign, Package, Receipt, TrendingUp } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "@/i18n/navigation";
import { getDashboardStats } from "@/lib/data/admin";
import { formatOrderNumber, formatPrice } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [stats, t] = await Promise.all([getDashboardStats(), getTranslations("AdminDashboard")]);

  const cards = [
    {
      label: t("totalRevenue"),
      value: formatPrice(stats.totalRevenueCents),
      icon: DollarSign,
    },
    {
      label: t("totalOrders"),
      value: stats.totalOrders.toString(),
      icon: Receipt,
    },
    {
      label: t("avgOrderValue"),
      value: formatPrice(stats.averageOrderValueCents),
      icon: TrendingUp,
    },
    {
      label: t("topProductUnits"),
      value: (stats.topProducts[0]?.unitsSold ?? 0).toString(),
      icon: Package,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{card.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("topSellingProducts")}</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noSales")}</p>
            ) : (
              <ul className="space-y-3">
                {stats.topProducts.map((tp, i) =>
                  tp.product ? (
                    <li key={tp.product.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className="text-muted-foreground">{i + 1}.</span>
                        {tp.product.title}
                      </span>
                      <span className="font-medium">{t("sold", { count: tp.unitsSold })}</span>
                    </li>
                  ) : null
                )}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("recentOrders")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("order")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("total")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline">
                        {formatOrderNumber(order.id)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{formatPrice(order.totalCents)}</TableCell>
                  </TableRow>
                ))}
                {stats.recentOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-sm text-muted-foreground">
                      {t("noOrders")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
