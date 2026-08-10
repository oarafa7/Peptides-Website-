import { Prisma, ProductStatus } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";

const productWithRelations = Prisma.validator<Prisma.ProductDefaultArgs>()({
  include: {
    images: { orderBy: { position: "asc" } },
    variants: true,
    category: true,
  },
});

export type ProductWithRelations = Prisma.ProductGetPayload<typeof productWithRelations>;

type LocalizableProduct = {
  title: string;
  titleAr: string | null;
  description: string;
  descriptionAr: string | null;
  materials: string | null;
  materialsAr: string | null;
  shippingReturns: string | null;
  shippingReturnsAr: string | null;
  category?: { name: string; nameAr: string | null; description: string | null; descriptionAr: string | null } | null;
  reviews?: { title: string | null; titleAr: string | null; body: string; bodyAr: string | null }[];
};

function localizeProduct<T extends LocalizableProduct>(product: T, locale: Locale): T {
  return {
    ...product,
    title: locale === "ar" && product.titleAr ? product.titleAr : product.title,
    description: locale === "ar" && product.descriptionAr ? product.descriptionAr : product.description,
    materials: locale === "ar" && product.materialsAr ? product.materialsAr : product.materials,
    shippingReturns:
      locale === "ar" && product.shippingReturnsAr ? product.shippingReturnsAr : product.shippingReturns,
    category: product.category
      ? {
          ...product.category,
          name: locale === "ar" && product.category.nameAr ? product.category.nameAr : product.category.name,
          description:
            locale === "ar" && product.category.descriptionAr
              ? product.category.descriptionAr
              : product.category.description,
        }
      : product.category,
    reviews: product.reviews?.map((r) => ({
      ...r,
      title: locale === "ar" && r.titleAr ? r.titleAr : r.title,
      body: locale === "ar" && r.bodyAr ? r.bodyAr : r.body,
    })),
  };
}

function localizeCategory<T extends { name: string; nameAr: string | null; description: string | null; descriptionAr: string | null }>(
  category: T,
  locale: Locale
): T {
  return {
    ...category,
    name: locale === "ar" && category.nameAr ? category.nameAr : category.name,
    description: locale === "ar" && category.descriptionAr ? category.descriptionAr : category.description,
  };
}

export type ProductFilters = {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "price-asc" | "price-desc" | "featured";
  inStockOnly?: boolean;
  q?: string;
};

export async function getProducts(filters: ProductFilters = {}, locale: Locale = "en") {
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
      { titleAr: { contains: filters.q, mode: "insensitive" } },
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

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: productWithRelations.include,
  });

  return products.map((p) => localizeProduct(p, locale));
}

export async function getFeaturedProducts(limit = 8, locale: Locale = "en") {
  const products = await prisma.product.findMany({
    where: { status: ProductStatus.ACTIVE, isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: productWithRelations.include,
  });

  return products.map((p) => localizeProduct(p, locale));
}

export async function getProductBySlug(slug: string, locale: Locale = "en") {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      ...productWithRelations.include,
      reviews: { where: { isApproved: true }, orderBy: { createdAt: "desc" } },
    },
  });

  return product ? localizeProduct(product, locale) : product;
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 4,
  locale: Locale = "en"
) {
  const products = await prisma.product.findMany({
    where: {
      status: ProductStatus.ACTIVE,
      id: { not: productId },
      ...(categoryId ? { categoryId } : {}),
    },
    take: limit,
    include: productWithRelations.include,
  });

  return products.map((p) => localizeProduct(p, locale));
}

export async function getCategories(locale: Locale = "en") {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return categories.map((c) => localizeCategory(c, locale));
}

export async function getCategoryBySlug(slug: string, locale: Locale = "en") {
  const category = await prisma.category.findUnique({ where: { slug } });
  return category ? localizeCategory(category, locale) : category;
}

export async function getProductsByIds(ids: string[], locale: Locale = "en") {
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: productWithRelations.include,
  });

  return products.map((p) => localizeProduct(p, locale));
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
