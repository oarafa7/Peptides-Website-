import { CheckCircle2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;
  const t = await getTranslations("OrderConfirmation");

  if (!sessionId) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">{t("notFoundTitle")}</h1>
        <Button asChild variant="outline">
          <Link href="/shop">{t("backToShop")}</Link>
        </Button>
      </div>
    );
  }

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });
  } catch {
    session = null;
  }

  if (!session) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">{t("notRetrievedTitle")}</h1>
        <Button asChild variant="outline">
          <Link href="/shop">{t("backToShop")}</Link>
        </Button>
      </div>
    );
  }

  const lineItems = session.line_items?.data ?? [];

  return (
    <div className="container-page max-w-2xl py-16">
      <div className="mb-8 flex flex-col items-center text-center">
        <CheckCircle2 className="h-14 w-14 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-semibold">{t("confirmedTitle")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("receiptSentTo", { email: session.customer_details?.email ?? "" })}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("orderReference", { ref: session.id.slice(-12).toUpperCase() })}
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="mb-4 text-sm font-semibold">{t("summaryTitle")}</h2>
        <ul className="space-y-3">
          {lineItems.map((li) => (
            <li key={li.id} className="flex justify-between text-sm">
              <span>
                {li.description} &times; {li.quantity}
              </span>
              <span className="font-medium">{formatPrice(li.amount_total)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t pt-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>{t("subtotal")}</span>
            <span>{formatPrice(session.amount_subtotal ?? 0)}</span>
          </div>
          {session.shipping_cost && (
            <div className="flex justify-between text-muted-foreground">
              <span>{t("shipping")}</span>
              <span>{formatPrice(session.shipping_cost.amount_total ?? 0)}</span>
            </div>
          )}
          {!!session.total_details?.amount_tax && (
            <div className="flex justify-between text-muted-foreground">
              <span>{t("tax")}</span>
              <span>{formatPrice(session.total_details.amount_tax)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 text-base font-semibold">
            <span>{t("total")}</span>
            <span>{formatPrice(session.amount_total ?? 0)}</span>
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
