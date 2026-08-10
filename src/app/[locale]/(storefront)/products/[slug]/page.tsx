import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AddToCart } from "@/components/storefront/add-to-cart";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductGrid } from "@/components/storefront/product-grid";
import { ReviewsSection } from "@/components/storefront/reviews-section";
import { StarRating } from "@/components/shared/star-rating";
import type { Locale } from "@/i18n/routing";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/products";

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const product = await getProductBySlug(params.slug, params.locale as Locale);
  return { title: product?.title ?? "Product" };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const locale = (await getLocale()) as Locale;
  const product = await getProductBySlug(params.slug, locale);
  if (!product || product.status !== "ACTIVE") notFound();

  const [related, t] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId, 4, locale),
    getTranslations("Product"),
  ]);
  const average =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

  return (
    <div className="container-page py-10">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />

        <div>
          {product.category && (
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              {product.category.name}
            </p>
          )}
          <h1 className="mt-1 font-display text-3xl font-semibold">{product.title}</h1>

          {product.reviews.length > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <StarRating rating={average} />
              <span className="text-xs text-muted-foreground">({product.reviews.length})</span>
            </div>
          )}

          <div className="mt-6">
            <AddToCart
              product={{
                id: product.id,
                title: product.title,
                slug: product.slug,
                priceCents: product.priceCents,
                stockQuantity: product.stockQuantity,
                trackInventory: product.trackInventory,
              }}
              variants={product.variants}
              primaryImage={product.images[0]?.url ?? null}
            />
          </div>

          <div className="mt-10">
            <Accordion type="single" collapsible defaultValue="description">
              <AccordionItem value="description">
                <AccordionTrigger>{t("description")}</AccordionTrigger>
                <AccordionContent className="whitespace-pre-line text-muted-foreground">
                  {product.description}
                </AccordionContent>
              </AccordionItem>
              {product.materials && (
                <AccordionItem value="materials">
                  <AccordionTrigger>{t("materials")}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {product.materials}
                  </AccordionContent>
                </AccordionItem>
              )}
              <AccordionItem value="shipping">
                <AccordionTrigger>{t("shippingReturns")}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {product.shippingReturns ?? t("shippingReturnsFallback")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>

      <div className="mt-20 max-w-3xl">
        <h2 className="mb-6 font-display text-2xl font-semibold">{t("reviewsTitle")}</h2>
        <ReviewsSection reviews={product.reviews} />
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-semibold">{t("youMayAlsoLike")}</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
