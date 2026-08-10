"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

type CheckoutInput = {
  items: { productId: string; variantId: string | null; quantity: number }[];
  couponCode?: string;
};

type CheckoutResult = { url: string } | { error: string };

export async function createCheckoutSession(input: CheckoutInput): Promise<CheckoutResult> {
  if (input.items.length === 0) {
    return { error: "Your cart is empty." };
  }

  const session = await getServerSession(authOptions);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const lineItems: {
    price_data: {
      currency: string;
      product_data: { name: string; images: string[]; metadata: Record<string, string> };
      unit_amount: number;
    };
    quantity: number;
  }[] = [];

  for (const item of input.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      include: { images: { take: 1, orderBy: { position: "asc" } }, variants: true },
    });

    if (!product) return { error: "One of the items in your cart is no longer available." };

    const variant = item.variantId ? product.variants.find((v) => v.id === item.variantId) : null;

    const stock = variant ? variant.stockQuantity : product.stockQuantity;
    if (product.trackInventory && stock < item.quantity) {
      return { error: `${product.title} doesn't have enough stock left.` };
    }

    const unitAmount = variant?.priceCents ?? product.priceCents;

    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: {
          name: variant ? `${product.title} - ${variant.name}` : product.title,
          images: product.images[0] ? [product.images[0].url] : [],
          metadata: {
            productId: product.id,
            variantId: variant?.id ?? "",
          },
        },
        unit_amount: unitAmount,
      },
      quantity: item.quantity,
    });
  }

  let discounts: { coupon: string }[] | undefined;
  let couponId: string | undefined;
  let freeShipping = false;

  if (input.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: input.couponCode.toUpperCase() } });
    const subtotalCents = lineItems.reduce(
      (sum, li) => sum + li.price_data.unit_amount * li.quantity,
      0
    );

    if (!coupon || !coupon.isActive) {
      return { error: "That promo code is invalid." };
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return { error: "That promo code has expired." };
    }
    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return { error: "That promo code has reached its usage limit." };
    }
    if (coupon.minSubtotalCents && subtotalCents < coupon.minSubtotalCents) {
      return { error: `This code requires a minimum order of $${(coupon.minSubtotalCents / 100).toFixed(2)}.` };
    }

    couponId = coupon.id;

    if (coupon.type === "PERCENTAGE") {
      const stripeCoupon = await stripe.coupons.create({ percent_off: coupon.value, duration: "once" });
      discounts = [{ coupon: stripeCoupon.id }];
    } else if (coupon.type === "FIXED_AMOUNT") {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: coupon.value,
        currency: "usd",
        duration: "once",
      });
      discounts = [{ coupon: stripeCoupon.id }];
    } else if (coupon.type === "FREE_SHIPPING") {
      freeShipping = true;
    }
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session?.user?.email ?? undefined,
      line_items: lineItems,
      discounts,
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: freeShipping ? 0 : 999,
              currency: "usd",
            },
            display_name: freeShipping ? "Free shipping (promo)" : "Standard shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
      automatic_tax: { enabled: false },
      metadata: {
        userId: session?.user?.id ?? "",
        couponId: couponId ?? "",
        couponCode: input.couponCode ?? "",
      },
      success_url: `${siteUrl}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
    });

    if (!checkoutSession.url) {
      return { error: "Could not start checkout. Please try again." };
    }

    return { url: checkoutSession.url };
  } catch (err) {
    console.error("Stripe checkout session error", err);
    return { error: "Checkout is currently unavailable. Please try again shortly." };
  }
}
