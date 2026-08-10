import { Prisma, ProductStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const productWithRelations = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    images: { orderBy: { position: "asc" } },
    variants: true,
    category: true,
  },
});

export type ProductWithRelations = Prisma.ProductGetPayload<typeof productWithRelations>;

export type ProductFilters = {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "featured";
  inStockOnly?: boolean;
  q?: string;
};

export async function getProducts(filters: ProductFilters = {}) {
  const where: Prisma.ProductWhereInput = {
    status: ProductStatus.ACTIVE,
  };

  if (filters.categorySlug) {
    where.category = { slug: filters.categorySlug };
  }

  if (filters.minPrice != null || filters.maxPrice != null) {
    where.priceCents = {
      ...(filters.minPrice != null ? { gte: filters.minPrice } : {}),
      ...(filters.maxPrice != null ? { lte: filters.maxPrice } : {}),
    };
  }

  if (filters.inStockOnly) {
    where.stockQuantity = { gt: 0 };
  }

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
      { tags: { has: filters.q.toLowerCase() } },
    ];
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "price-asc"
      ? { priceCents: "asc" }
      : filters.sort === "price-desc"
      ? { priceCents: "desc" }
      : filters.sort === "featured"
      ? { isFeatured: "desc" }
      : { createdAt: "desc" };

  return prisma.product.findMany({
    where,
    orderBy,
    include: productWithRelations.include,
  });
}

export async function getFeaturedProducts(limit = 8) {
  return prisma.product.findMany({
    where: { status: ProductStatus.ACTIVE, isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: productWithRelations.include,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      ...productWithRelations.include,
      reviews: { where: { isApproved: true }, orderBy: { createdAt: "desc" } },
    },
  });
}

export async function getRelatedProducts(productId: string, categoryId: string | null, limit = 4) {
  return prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      id: { not: productId },
      ...(categoryId ? { categoryId } : {}),
    },
    take: limit,
    include: productWithRelations.include,
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getPriceBounds() {
  const agg = await prisma.product.aggregate({
    where: { status: ProductStatus.ACTIVE },
    _min: { priceCents: true },
    _max: { priceCents: true },
  });
  return {
    min: agg._min.priceCents ?? 0,
    max: agg._max.priceCents ?? 10000,
  };
}
