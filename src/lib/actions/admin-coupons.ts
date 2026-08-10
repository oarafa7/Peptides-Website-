"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { DiscountType } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/guard";

const couponSchema = z.object({
  code: z.string().min(2).transform((v) => v.toUpperCase()),
  type: z.nativeEnum(DiscountType),
  value: z.coerce.number().int().nonnegative(),
  minSubtotalCents: z.coerce.number().int().nonnegative().optional(),
  usageLimit: z.coerce.number().int().positive().optional(),
  expiresAt: z.string().optional(),
});

export async function createCoupon(formData: FormData) {
  await requireAdmin();

  const parsed = couponSchema.parse({
    code: formData.get("code"),
    type: formData.get("type"),
    value: formData.get("value"),
    minSubtotalCents: formData.get("minSubtotalCents") || undefined,
    usageLimit: formData.get("usageLimit") || undefined,
    expiresAt: formData.get("expiresAt") || undefined,
  });

  await prisma.coupon.create({
    data: {
      code: parsed.code,
      type: parsed.type,
      value: parsed.value,
      minSubtotalCents: parsed.minSubtotalCents || null,
      usageLimit: parsed.usageLimit || null,
      expiresAt: parsed.expiresAt ? new Date(parsed.expiresAt) : null,
    },
  });

  revalidatePath("/admin/coupons");
}

export async function toggleCoupon(couponId: string, isActive: boolean) {
  await requireAdmin();
  await prisma.coupon.update({ where: { id: couponId }, data: { isActive } });
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(couponId: string) {
  await requireAdmin();
  await prisma.coupon.delete({ where: { id: couponId } });
  revalidatePath("/admin/coupons");
}
