"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/storefront/product-grid";
import { Link } from "@/i18n/navigation";
import { useWishlist } from "@/lib/store/wishlist";
import type { ProductWithRelations } from "@/lib/data/products";

export default function WishlistPage() {
  const t = useTranslations("Wishlist");
  const locale = useLocale();
  const productIds = useWishlist((s) => s.productIds);
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/products/by-ids?ids=${productIds.join(",")}&locale=${locale}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, [productIds, locale]);

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>

      <div className="mt-8">
        {!loading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Heart className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
            <Button asChild variant="outline">
              <Link href="/shop">{t("browseProducts")}</Link>
            </Button>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
