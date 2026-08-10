import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutCompleted(session);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const existing = await prisma.order.findUnique({ where: { stripeCheckoutId: session.id } });
  if (existing) return;

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
    expand: ["data.price.product"],
  });

  const userId = session.metadata?.userId || undefined;
  const couponId = session.metadata?.couponId || undefined;

  const shipping = session.collected_information?.shipping_details;
  const address = session.customer_details?.address;

  let addressId: string | undefined;
  if (address?.line1) {
    const createdAddress = await prisma.address.create({
      data: {
        userId: userId || undefined,
        fullName: shipping?.name ?? session.customer_details?.name ?? "Customer",
        line1: address.line1,
        line2: address.line2 ?? undefined,
        city: address.city ?? "",
        state: address.state ?? "",
        postalCode: address.postal_code ?? "",
        country: address.country ?? "US",
      },
    });
    addressId = createdAddress.id;
  }

  const subtotalCents = session.amount_subtotal ?? 0;
  const totalCents = session.amount_total ?? 0;
  const shippingCents = session.shipping_cost?.amount_total ?? 0;
  const taxCents = session.total_details?.amount_tax ?? 0;
  const discountCents = Math.max(0, subtotalCents + shippingCents + taxCents - totalCents);

  const order = await prisma.order.create({
    data: {
      userId: userId || undefined,
      email: session.customer_details?.email ?? session.customer_email ?? "unknown@example.com",
      status: "PAID",
      subtotalCents,
      discountCents,
      taxCents,
      shippingCents,
      totalCents,
      currency: session.currency ?? "usd",
      couponId,
      addressId,
      stripeCheckoutId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
    },
  });

  for (const li of lineItems.data) {
    const product = li.price?.product as Stripe.Product | undefined;
    const productId = product?.metadata?.productId || undefined;
    const variantId = product?.metadata?.variantId || undefined;

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: productId || undefined,
        variantId: variantId || undefined,
        titleSnapshot: li.description ?? product?.name ?? "Item",
        unitPriceCents: li.price?.unit_amount ?? 0,
        quantity: li.quantity ?? 1,
        imageSnapshot: product?.images?.[0],
      },
    });

    if (productId) {
      if (variantId) {
        await prisma.variant
          .update({ where: { id: variantId }, data: { stockQuantity: { decrement: li.quantity ?? 1 } } })
          .catch(() => undefined);
      } else {
        await prisma.product
          .update({ where: { id: productId }, data: { stockQuantity: { decrement: li.quantity ?? 1 } } })
          .catch(() => undefined);
      }
    }
  }

  if (couponId) {
    await prisma.coupon.update({
      where: { id: couponId },
      data: { timesUsed: { increment: 1 } },
    });
    await prisma.couponRedemption.create({
      data: { couponId, userId: userId || undefined },
    });
  }
}
