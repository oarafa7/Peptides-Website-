import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getOrderForUser } from "@/lib/data/account";
import { formatOrderNumber, formatPrice } from "@/lib/utils";

export default async function AccountOrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) notFound();

  const [order, t, locale] = await Promise.all([
    getOrderForUser(session.user.id, params.id),
    getTranslations("Orders"),
    getLocale(),
  ]);
  if (!order) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{formatOrderNumber(order.id)}</h1>
          <p className="text-sm text-muted-foreground">
            {t("placed", { date: order.createdAt.toLocaleString(locale) })}
          </p>
        </div>
        <Badge>{order.status}</Badge>
      </div>

      <p className="text-sm text-muted-foreground">
        {t("paymentMethod")}: {order.paymentMethod === "INSTAPAY" ? t("paymentInstaPay") : t("paymentCod")}
      </p>

      {order.trackingNumber && (
        <Card>
          <CardHeader>
            <CardTitle>{t("tracking")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {order.trackingCarrier ?? t("trackingCarrier")}: {order.trackingNumber}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("items")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{item.titleSnapshot}</p>
                  <p className="text-muted-foreground">{t("qty", { count: item.quantity })}</p>
                </div>
                <p className="font-medium">{formatPrice(item.unitPriceCents * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t pt-4 text-base font-semibold">
            <span>{t("total")}</span>
            <span>{formatPrice(order.totalCents)}</span>
          </div>
        </CardContent>
      </Card>

      {order.address && (
        <Card>
          <CardHeader>
            <CardTitle>{t("shippingAddress")}</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>{order.address.fullName}</p>
            <p>{order.address.line1}</p>
            {order.address.line2 && <p>{order.address.line2}</p>}
            <p>
              {order.address.city}
              {order.address.state ? `, ${order.address.state}` : ""}
              {order.address.postalCode ? ` ${order.address.postalCode}` : ""}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
