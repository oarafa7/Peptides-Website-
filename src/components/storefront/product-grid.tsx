"use client";

import { useTranslations } from "next-intl";

import { ProductCard } from "@/components/storefront/product-card";
import type { ProductWithRelations } from "@/lib/data/products";

export function ProductGrid({ products }: { products: ProductWithRelations[] }) {
  const t = useTranslations("Shop");

  if (products.length === 0) {
    return (
      <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">{t("noProductsMatch")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
