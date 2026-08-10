"use client";

import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";
import { useWishlist } from "@/lib/store/wishlist";
import type { ProductWithRelations } from "@/lib/data/products";

export function ProductCard({ product }: { product: ProductWithRelations }) {
  const t = useTranslations("Product");
  const addItem = useCart((s) => s.addItem);
  const wishlisted = useWishlist((s) => s.has(product.id));
  const toggleWishlist = useWishlist((s) => s.toggle);

  const isNew =
    Date.now() - new Date(product.createdAt).getTime() < 1000 * 60 * 60 * 24 * 30 ||
    product.tags.includes("new");
  const isOnSale = product.compareAtCents && product.compareAtCents > product.priceCents;
  const inStock = product.stockQuantity > 0;

  const primaryImage = product.images[0]?.url;
  const secondaryImage = product.images[1]?.url;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!inStock) return;
    const defaultVariant = product.variants[0];
    addItem(
      {
        productId: product.id,
        variantId: defaultVariant?.id ?? null,
        title: product.title,
        variantLabel: defaultVariant?.name ?? null,
        priceCents: defaultVariant?.priceCents ?? product.priceCents,
        imageUrl: primaryImage ?? null,
        slug: product.slug,
        maxQuantity: defaultVariant?.stockQuantity ?? product.stockQuantity,
      },
      1
    );
    toast.success(t("addedToCart", { title: product.title }));
  }

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          {primaryImage && (
            <Image
              src={primaryImage}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className={cn(
                "object-cover transition-opacity duration-300",
                secondaryImage && "group-hover:opacity-0"
              )}
            />
          )}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={product.title}
              fill
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            />
          )}

          <div className="absolute start-2 top-2 flex flex-col gap-1.5">
            {isOnSale && <Badge variant="destructive">{t("sale")}</Badge>}
            {isNew && <Badge variant="success">{t("new")}</Badge>}
            {!inStock && <Badge variant="secondary">{t("soldOut")}</Badge>}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id);
            }}
            className="absolute end-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background/90 shadow-sm transition-transform hover:scale-105"
            aria-label={t("toggleWishlist")}
          >
            <Heart className={cn("h-4 w-4", wishlisted && "fill-primary text-primary")} />
          </button>

          {inStock && (
            <button
              onClick={quickAdd}
              className="absolute inset-x-2 bottom-2 flex translate-y-10 items-center justify-center gap-2 rounded-md bg-foreground/90 py-2 text-xs font-semibold text-background opacity-0 backdrop-blur transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
            >
              <ShoppingBag className="h-3.5 w-3.5" /> {t("quickAdd")}
            </button>
          )}
        </div>

        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-medium text-foreground">{product.title}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">{formatPrice(product.priceCents)}</span>
            {isOnSale && (
              <span className="text-muted-foreground line-through">
                {formatPrice(product.compareAtCents!)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
