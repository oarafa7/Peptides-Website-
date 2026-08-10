import { ArrowRight, FlaskConical, ShieldCheck, Snowflake } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { Hero } from "@/components/storefront/hero";
import { ProductGrid } from "@/components/storefront/product-grid";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getCategories, getFeaturedProducts } from "@/lib/data/products";

export default async function HomePage() {
  const locale = (await getLocale()) as Locale;
  const [featured, categories, t] = await Promise.all([
    getFeaturedProducts(8, locale),
    getCategories(locale),
    getTranslations("Home"),
  ]);

  return (
    <>
      <Hero />

      <section className="border-b bg-background py-10">
        <div className="container-page grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-semibold">{t("hplcTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("hplcDesc")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Snowflake className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-semibold">{t("coldChainTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("coldChainDesc")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
              <p className="text-sm font-semibold">{t("coaTitle")}</p>
              <p className="text-xs text-muted-foreground">{t("coaDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">{t("featuredTitle")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("featuredSubtitle")}</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/shop">
              {t("viewAll")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container-page">
          <h2 className="mb-8 font-display text-2xl font-semibold sm:text-3xl">{t("categoriesTitle")}</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/collections/${category.slug}`}
                className="group flex flex-col items-center justify-center rounded-xl border bg-background p-6 text-center transition-shadow hover:shadow-md"
              >
                <span className="text-sm font-semibold group-hover:text-primary">{category.name}</span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {t("productsCount", { count: category._count.products })}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="rounded-2xl bg-ink-950 px-8 py-14 text-center text-white">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">{t("ctaDescription")}</p>
          <Button size="lg" className="mt-6" asChild>
            <Link href="/shop">{t("ctaButton")}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
