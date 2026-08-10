"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { OrderStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/actions/guard";

const updateSchema = z.object({
  orderId: z.string(),
  status: z.nativeEnum(OrderStatus).optional(),
  trackingNumber: z.string().optional(),
  trackingCarrier: z.string().optional(),
});

export async function updateOrder(input: z.infer<typeof updateSchema>) {
  await requireAdmin();
  const parsed = updateSchema.parse(input);

  await prisma.order.update({
    where: { id: parsed.orderId },
    data: {
      status: parsed.status,
      trackingNumber: parsed.trackingNumber,
      trackingCarrier: parsed.trackingCarrier,
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${parsed.orderId}`);
  revalidatePath("/account/orders");
}
