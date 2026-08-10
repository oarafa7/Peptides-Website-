import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { stripe } from "@/lib/stripe";

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const sessionId = searchParams.session_id;

  if (!sessionId) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">No order found</h1>
        <Button asChild variant="outline">
          <Link href="/shop">Back to shop</Link>
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
        <h1 className="font-display text-2xl font-semibold">We couldn&apos;t find that order</h1>
        <Button asChild variant="outline">
          <Link href="/shop">Back to shop</Link>
        </Button>
      </div>
    );
  }

  const lineItems = session.line_items?.data ?? [];

  return (
    <div className="container-page max-w-2xl py-16">
      <div className="mb-8 flex flex-col items-center text-center">
        <CheckCircle2 className="h-14 w-14 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-semibold">Order confirmed</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A receipt has been sent to {session.customer_details?.email ?? "your email"}.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Order reference: {session.id.slice(-12).toUpperCase()}
        </p>
      </div>

      <div className="rounded-xl border p-6">
        <h2 className="mb-4 text-sm font-semibold">Order Summary</h2>
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
            <span>Subtotal</span>
            <span>{formatPrice(session.amount_subtotal ?? 0)}</span>
          </div>
          {session.shipping_cost && (
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>{formatPrice(session.shipping_cost.amount_total ?? 0)}</span>
            </div>
          )}
          {!!session.total_details?.amount_tax && (
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>{formatPrice(session.total_details.amount_tax)}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(session.amount_total ?? 0)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link href="/shop">Continue shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/account/orders">View order history</Link>
        </Button>
      </div>
    </div>
  );
}
