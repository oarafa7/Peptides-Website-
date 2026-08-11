"use server";

import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

const SHIPPING_CENTS = 7500;
const FREE_SHIPPING_THRESHOLD_CENTS = 150000;

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        variantId: z.string().nullable(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  couponCode: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(6),
  fullName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  paymentMethod: z.enum(["INSTAPAY", "COD"]),
  paymentReference: z.string().optional(),
});

export type PlaceOrderInput = z.infer<typeof checkoutSchema>;
type PlaceOrderResult = { orderId: string } | { error: string };

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please check the form and try again." };
  }
  const data = parsed.data;

  const session = await getServerSession(authOptions);

  let subtotalCents = 0;
  const orderItemsData: {
    productId: string;
    variantId: string | null;
    titleSnapshot: string;
    variantSnapshot: string | null;
    imageSnapshot: string | null;
    unitPriceCents: number;
    quantity: number;
  }[] = [];

  for (const item of data.items) {
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

    const unitPriceCents = variant?.priceCents ?? product.priceCents;
    subtotalCents += unitPriceCents * item.quantity;

    orderItemsData.push({
      productId: product.id,
      variantId: variant?.id ?? null,
      titleSnapshot: variant ? `${product.title} - ${variant.name}` : product.title,
      variantSnapshot: variant?.name ?? null,
      imageSnapshot: product.images[0]?.url ?? null,
      unitPriceCents,
      quantity: item.quantity,
    });
  }

  let discountCents = 0;
  let couponId: string | undefined;
  let freeShipping = false;

  if (data.couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: data.couponCode.toUpperCase() } });
    if (!coupon || !coupon.isActive) return { error: "That promo code is invalid." };
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return { error: "That promo code has expired." };
    if (coupon.usageLimit && coupon.timesUsed >= coupon.usageLimit) {
      return { error: "That promo code has reached its usage limit." };
    }
    if (coupon.minSubtotalCents && subtotalCents < coupon.minSubtotalCents) {
      return { error: `This code requires a minimum order of ${formatPrice(coupon.minSubtotalCents)}.` };
    }

    couponId = coupon.id;
    if (coupon.type === "PERCENTAGE") {
      discountCents = Math.round((subtotalCents * coupon.value) / 100);
    } else if (coupon.type === "FIXED_AMOUNT") {
      discountCents = Math.min(coupon.value, subtotalCents);
    } else if (coupon.type === "FREE_SHIPPING") {
      freeShipping = true;
    }
  }

  const shippingCents =
    freeShipping || subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS;
  const totalCents = subtotalCents - discountCents + shippingCents;

  const address = await prisma.address.create({
    data: {
      userId: session?.user?.id ?? undefined,
      fullName: data.fullName,
      line1: data.line1,
      line2: data.line2 || undefined,
      city: data.city,
      state: data.state || undefined,
      postalCode: data.postalCode || undefined,
      country: "EG",
      phone: data.phone,
    },
  });

  const order = await prisma.order.create({
    data: {
      userId: session?.user?.id ?? undefined,
      email: data.email,
      phone: data.phone,
      status: "PENDING",
      paymentMethod: data.paymentMethod,
      paymentReference: data.paymentReference || undefined,
      subtotalCents,
      discountCents,
      shippingCents,
      totalCents,
      currency: "egp",
      couponId,
      addressId: address.id,
      items: { create: orderItemsData },
    },
  });

  for (const item of orderItemsData) {
    if (item.variantId) {
      await prisma.variant
        .update({ where: { id: item.variantId }, data: { stockQuantity: { decrement: item.quantity } } })
        .catch(() => undefined);
    } else {
      await prisma.product
        .update({ where: { id: item.productId }, data: { stockQuantity: { decrement: item.quantity } } })
        .catch(() => undefined);
    }
  }

  if (couponId) {
    await prisma.coupon.update({ where: { id: couponId }, data: { timesUsed: { increment: 1 } } });
    await prisma.couponRedemption.create({
      data: { couponId, userId: session?.user?.id ?? undefined },
    });
  }

  return { orderId: order.id };
}
