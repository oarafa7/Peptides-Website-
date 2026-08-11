import "server-only";

import { prisma } from "@/lib/prisma";

export async function getOrderForConfirmation(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, address: true },
  });
}
