import "server-only";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [revenueAgg, orderCount, topProductsRaw, recentOrders] = await Promise.all([
    prisma.order.aggregate({
      _sum: { totalCents: true },
      where: { status: { in: ["PAID", "UNFULFILLED", "FULFILLED", "SHIPPED", "DELIVERED"] } },
    }),
    prisma.order.count({
      where: { status: { in: ["PAID", "UNFULFILLED", "FULFILLED", "SHIPPED", "DELIVERED"] } },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true },
      where: { productId: { not: null } },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { items: true },
    }),
  ]);

  const productIds = topProductsRaw.map((p) => p.productId).filter((id): id is string => !!id);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

  const topProducts = topProductsRaw.map((tp) => ({
    product: products.find((p) => p.id === tp.productId),
    unitsSold: tp._sum.quantity ?? 0,
  }));

  const totalRevenueCents = revenueAgg._sum.totalCents ?? 0;
  const averageOrderValueCents = orderCount > 0 ? Math.round(totalRevenueCents / orderCount) : 0;

  return {
    totalRevenueCents,
    totalOrders: orderCount,
    averageOrderValueCents,
    topProducts,
    recentOrders,
  };
}

export async function getAllOrders(status?: string) {
  return prisma.order.findMany({
    where: status ? { status: status as never } : undefined,
    orderBy: { createdAt: "desc" },
    include: { items: true, address: true },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: { items: true, address: true, user: true, coupon: true },
  });
}

export async function getAllProductsForAdmin() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { position: "asc" } }, variants: true, category: true },
  });
}

export async function getAdminProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } }, variants: true },
  });
}

export async function getAllCoupons() {
  return prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAllCategoriesForAdmin() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}
