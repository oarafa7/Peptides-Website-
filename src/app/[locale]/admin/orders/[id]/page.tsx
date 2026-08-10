import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderUpdateForm } from "@/components/admin/order-update-form";
import { getOrderById } from "@/lib/data/admin";
import { formatOrderNumber, formatPrice } from "@/lib/utils";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const [order, t, locale] = await Promise.all([
    getOrderById(params.id),
    getTranslations("AdminOrderDetail"),
    getLocale(),
  ]);
  if (!order) notFound();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">{formatOrderNumber(order.id)}</h1>
          <p className="text-sm text-muted-foreground">
            {t("placed", { date: order.createdAt.toLocaleString(locale), email: order.email })}
          </p>
        </div>
        <Badge>{order.status}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("itemsTitle")}</CardTitle>
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
              <div className="mt-4 space-y-1 border-t pt-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("subtotal")}</span>
                  <span>{formatPrice(order.subtotalCents)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("discount")}</span>
                  <span>-{formatPrice(order.discountCents)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("shipping")}</span>
                  <span>{formatPrice(order.shippingCents)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("tax")}</span>
                  <span>{formatPrice(order.taxCents)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold">
                  <span>{t("total")}</span>
                  <span>{formatPrice(order.totalCents)}</span>
                </div>
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
                  {order.address.city}, {order.address.state} {order.address.postalCode}
                </p>
                <p>{order.address.country}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("fulfillmentTitle")}</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderUpdateForm
              orderId={order.id}
              status={order.status}
              trackingNumber={order.trackingNumber}
              trackingCarrier={order.trackingCarrier}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
