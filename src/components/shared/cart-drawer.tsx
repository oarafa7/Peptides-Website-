"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/navigation";
import { useCart, useCartTotals } from "@/lib/store/cart";
import { cn, formatPrice } from "@/lib/utils";
import { createCheckoutSession } from "@/lib/actions/checkout";

export function CartDrawer() {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const couponCode = useCart((s) => s.couponCode);
  const setCoupon = useCart((s) => s.setCoupon);
  const { subtotalCents } = useCartTotals();

  const [couponInput, setCouponInput] = useState(couponCode ?? "");
  const [isPending, startTransition] = useTransition();

  function handleCheckout() {
    startTransition(async () => {
      const result = await createCheckoutSession({
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        couponCode: couponCode ?? undefined,
      });

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      window.location.href = result.url;
    });
  }

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? useCart.getState().open() : close())}>
      <SheetContent side={locale === "ar" ? "left" : "right"} className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> {t("title")}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
            <Button onClick={close} variant="outline">
              {t("continueShopping")}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                      {item.imageUrl && (
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="80px" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={close}
                            className="text-sm font-medium hover:underline"
                          >
                            {item.title}
                          </Link>
                          {item.variantLabel && (
                            <p className="text-xs text-muted-foreground">{item.variantLabel}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.productId, item.variantId)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-md border">
                          <button
                            className="p-1.5 disabled:opacity-40"
                            disabled={item.quantity <= 1}
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity - 1)
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm">{item.quantity}</span>
                          <button
                            className="p-1.5 disabled:opacity-40"
                            disabled={item.quantity >= item.maxQuantity}
                            onClick={() =>
                              updateQuantity(item.productId, item.variantId, item.quantity + 1)
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="text-sm font-medium">
                          {formatPrice(item.priceCents * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t px-6 py-4">
              <div className="mb-3 flex gap-2">
                <Input
                  placeholder={t("promoCode")}
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setCoupon(couponInput || null);
                    toast.success(couponInput ? t("codeApplied", { code: couponInput }) : t("codeCleared"));
                  }}
                >
                  {t("apply")}
                </Button>
              </div>
              {couponCode && (
                <div className="mb-3 flex items-center justify-between rounded-md bg-accent px-3 py-1.5 text-xs text-accent-foreground">
                  <span>{t("codeWillApply", { code: couponCode })}</span>
                  <button onClick={() => setCoupon(null)}>
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <Separator className="mb-3" />
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span className="font-semibold">{formatPrice(subtotalCents)}</span>
              </div>
              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isPending}>
                {isPending ? t("redirecting") : t("checkout")}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">{t("shippingTaxes")}</p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function CartTriggerBadge({ className }: { className?: string }) {
  const { itemCount } = useCartTotals();
  if (itemCount === 0) return null;
  return (
    <span
      className={cn(
        "absolute -end-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground",
        className
      )}
    >
      {itemCount > 9 ? "9+" : itemCount}
    </span>
  );
}
