import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductFilters } from "@/components/storefront/product-filters";
import { ProductGrid } from "@/components/storefront/product-grid";
import {
  getCategories,
  getCategoryBySlug,
  getPriceBounds,
  getProducts,
  type ProductFilters as Filters,
} from "@/lib/data/products";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  return { title: category?.name ?? "Collection" };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | undefined };
}) {
  const category = await getCategoryBySlug(params.slug);
  if (!category) notFound();

  const filters: Filters = {
    categorySlug: params.slug,
    minPrice: searchParams.min ? Number(searchParams.min) : undefined,
    maxPrice: searchParams.max ? Number(searchParams.max) : undefined,
    sort: (searchParams.sort as Filters["sort"]) ?? "newest",
    inStockOnly: searchParams.inStock === "1",
  };

  const [products, categories, priceBounds] = await Promise.all([
    getProducts(filters),
    getCategories(),
    getPriceBounds(),
  ]);

  return (
    <div className="container-page py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="font-display text-3xl font-semibold">{category.name}</h1>
        {category.description && (
          <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <ProductFilters categories={categories} priceBounds={priceBounds} hideCategory />
        </aside>
        <div>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
