import Link from "next/link";
import { ArrowRight, FlaskConical, ShieldCheck, Snowflake } from "lucide-react";

import { Hero } from "@/components/storefront/hero";
import { ProductGrid } from "@/components/storefront/product-grid";
import { Button } from "@/components/ui/button";
import { getCategories, getFeaturedProducts } from "@/lib/data/products";

export default async function HomePage() {
  const [featured, categories] = await Promise.all([getFeaturedProducts(8), getCategories()]);

  return (
    <>
      <Hero />

      <section className="border-b bg-background py-10">
        <div className="container-page grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-semibold">HPLC Verified</p>
              <p className="text-xs text-muted-foreground">Every batch tested &gt;99% purity</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Snowflake className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-semibold">Cold-Chain Shipping</p>
              <p className="text-xs text-muted-foreground">Insulated, temperature-controlled</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-semibold">Certificate of Analysis</p>
              <p className="text-xs text-muted-foreground">Included with every order</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Featured Products</h2>
            <p className="mt-1 text-sm text-muted-foreground">Our most-requested research compounds.</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/shop">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container-page">
          <h2 className="mb-8 font-display text-2xl font-semibold sm:text-3xl">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/collections/${category.slug}`}
                className="group flex flex-col items-center justify-center rounded-xl border bg-background p-6 text-center transition-shadow hover:shadow-md"
              >
                <span className="text-sm font-semibold group-hover:text-primary">{category.name}</span>
                <span className="mt-1 text-xs text-muted-foreground">{category._count.products} products</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="rounded-2xl bg-ink-950 px-8 py-14 text-center text-white">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            Every order ships with a Certificate of Analysis
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
            We test every production batch via independent third-party HPLC and mass
            spectrometry labs so you can trust what&apos;s in the vial.
          </p>
          <Button size="lg" className="mt-6" asChild>
            <Link href="/shop">Browse the catalog</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
