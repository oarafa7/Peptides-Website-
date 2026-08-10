import type { Metadata } from "next";

import { ProductFilters } from "@/components/storefront/product-filters";
import { ProductGrid } from "@/components/storefront/product-grid";
import { getCategories, getPriceBounds, getProducts, type ProductFilters as Filters } from "@/lib/data/products";

export const metadata: Metadata = { title: "Shop All" };

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

  const [products, categories, priceBounds] = await Promise.all([
    getProducts(filters),
    getCategories(),
    getPriceBounds(),
  ]);

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold">Shop All</h1>
        <p className="mt-1 text-sm text-muted-foreground">{products.length} products</p>
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
