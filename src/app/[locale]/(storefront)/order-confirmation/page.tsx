import { CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { formatOrderNumber, formatPrice } from "@/lib/utils";
import { getOrderForConfirmation } from "@/lib/data/orders";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const orderId = searchParams.orderId;
  const t = await getTranslations("OrderConfirmation");

  const order = orderId ? await getOrderForConfirmation(orderId) : null;

  if (!order) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">{t("notFoundTitle")}</h1>
        <Button asChild variant="outline">
          <Link href="/shop">{t("backToShop")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page max-w-2xl py-16">
      <div className="mb-8 flex flex-col items-center text-center">
        <CheckCircle2 className="h-14 w-14 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-semibold">{t("confirmedTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("receiptSentTo", { email: order.email })}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("orderReference", { ref: formatOrderNumber(order.id) })}
        </p>
      </div>

      <div className="mb-6 rounded-xl border p-6 text-sm">
        {order.paymentMethod === "INSTAPAY" ? (
          <div>
            <p className="font-semibold">{t("instapayPendingTitle")}</p>
            <p className="mt-1 text-muted-foreground">{t("instapayPendingBody")}</p>
          </div>
        ) : (
          <div>
            <p className="font-semibold">{t("codPendingTitle")}</p>
            <p className="mt-1 text-muted-foreground">
              {t("codPendingBody", { amount: formatPrice(order.totalCents) })}
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="mb-4 text-sm font-semibold">{t("summaryTitle")}</h2>
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>
                {item.titleSnapshot} &times; {item.quantity}
              </span>
              <span className="font-medium">{formatPrice(item.unitPriceCents * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t pt-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>{t("subtotal")}</span>
            <span>{formatPrice(order.subtotalCents)}</span>
          </div>
          {order.discountCents > 0 && (
            <div className="flex justify-between text-muted-foreground">
              <span>{t("discount")}</span>
              <span>-{formatPrice(order.discountCents)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>{t("shipping")}</span>
            <span>{order.shippingCents === 0 ? t("free") : formatPrice(order.shippingCents)}</span>
          </div>
          <div className="flex justify-between pt-2 text-base font-semibold">
            <span>{t("total")}</span>
            <span>{formatPrice(order.totalCents)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link href="/shop">{t("continueShopping")}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/account/orders">{t("viewOrderHistory")}</Link>
        </Button>
      </div>
    </div>
  );
}
