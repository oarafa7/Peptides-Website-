"use client";

import { useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/store/cart";

type Variant = {
  id: string;
  name: string;
  option1Name: string | null;
  option1Value: string | null;
  priceCents: number | null;
  stockQuantity: number;
};

export function AddToCart({
  product,
  variants,
  primaryImage,
}: {
  product: { id: string; title: string; slug: string; priceCents: number; stockQuantity: number; trackInventory: boolean };
  variants: Variant[];
  primaryImage: string | null;
}) {
  const t = useTranslations("Product");
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id ?? null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.open);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) ?? null;
  const price = selectedVariant?.priceCents ?? product.priceCents;
  const stock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity;
  const inStock = !product.trackInventory || stock > 0;

  const optionName = useMemo(() => {
    const raw = variants[0]?.option1Name;
    if (!raw) return t("option");
    const known: Record<string, string> = {
      Size: t("size"),
      Pack: t("pack"),
      Color: t("color"),
      Flavor: t("flavor"),
      Count: t("count"),
    };
    return known[raw] ?? raw;
  }, [variants, t]);

  function handleAdd() {
    addItem(
      {
        productId: product.id,
        variantId: selectedVariant?.id ?? null,
        title: product.title,
        variantLabel: selectedVariant?.name ?? null,
        priceCents: price,
        imageUrl: primaryImage,
        slug: product.slug,
        maxQuantity: stock,
      },
      quantity
    );
    toast.success(t("addedToCart", { title: product.title }));
    openCart();
  }

  return (
    <div className="space-y-6">
      <p className="text-2xl font-semibold">{formatPrice(price)}</p>

      {variants.length > 1 && (
        <div>
          <p className="mb-2 text-sm font-medium">{optionName}</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariantId(v.id)}
                disabled={v.stockQuantity <= 0}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                  selectedVariantId === v.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input hover:border-primary"
                )}
              >
                {v.option1Value ?? v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border">
          <button
            className="p-2.5 disabled:opacity-40"
            disabled={quantity <= 1}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button
            className="p-2.5 disabled:opacity-40"
            disabled={quantity >= stock}
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <Button size="lg" className="flex-1" disabled={!inStock} onClick={handleAdd}>
          {inStock ? t("addToCart") : t("soldOut")}
        </Button>
      </div>
      {product.trackInventory && stock > 0 && stock <= 10 && (
        <p className="text-xs text-amber-600">{t("onlyXLeft", { count: stock })}</p>
      )}
    </div>
  );
}
