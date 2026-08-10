import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { ProductFilters } from "@/components/storefront/product-filters";
import { ProductGrid } from "@/components/storefront/product-grid";
import type { Locale } from "@/i18n/routing";
import { getCategories, getPriceBounds, getProducts, type ProductFilters as Filters } from "@/lib/data/products";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Shop");
  return { title: t("title") };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const filters: Filters = {
    categorySlug: searchParams.category,
    minPrice: searchParams.min ? Number(searchParams.min) : undefined,
    maxPrice: searchParams.max ? Number(searchParams.max) : undefined,
    sort: (searchParams.sort as Filters["sort"]) ?? "newest",
    inStockOnly: searchParams.inStock === "1",
    q: searchParams.q,
  };

  const locale = (await getLocale()) as Locale;
  const [products, categories, priceBounds, t] = await Promise.all([
    getProducts(filters, locale),
    getCategories(locale),
    getPriceBounds(),
    getTranslations("Shop"),
  ]);

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("productsCount", { count: products.length })}</p>
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ProductFilters categories={categories} priceBounds={priceBounds} />
        </aside>
        <div>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
