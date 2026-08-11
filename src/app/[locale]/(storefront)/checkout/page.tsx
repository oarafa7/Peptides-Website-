"use client";

import { useEffect, useState, useTransition } from "react";
import { useSession } from "next-auth/react";
import { Banknote, Copy, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link, useRouter } from "@/i18n/navigation";
import { useCart, useCartTotals } from "@/lib/store/cart";
import { cn, formatPrice } from "@/lib/utils";
import { placeOrder } from "@/lib/actions/checkout";

const INSTAPAY_NUMBER = "01271950337";
const SHIPPING_CENTS = 7500;
const FREE_SHIPPING_THRESHOLD_CENTS = 150000;

export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const router = useRouter();
  const { data: session } = useSession();

  const items = useCart((s) => s.items);
  const couponCode = useCart((s) => s.couponCode);
  const clearCart = useCart((s) => s.clear);
  const { subtotalCents } = useCartTotals();

  const [paymentMethod, setPaymentMethod] = useState<"COD" | "INSTAPAY">("COD");
  const [isPending, startTransition] = useTransition();
  const [mounted, setMounted] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && items.length === 0 && !orderPlaced) {
      router.replace("/shop");
    }
  }, [mounted, items.length, orderPlaced, router]);

  const shippingCents = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_CENTS;
  const estimatedTotalCents = subtotalCents + shippingCents;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await placeOrder({
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          quantity: i.quantity,
        })),
        couponCode: couponCode ?? undefined,
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        fullName: String(formData.get("fullName") ?? ""),
        line1: String(formData.get("line1") ?? ""),
        line2: String(formData.get("line2") ?? "") || undefined,
        city: String(formData.get("city") ?? ""),
        state: String(formData.get("state") ?? "") || undefined,
        postalCode: String(formData.get("postalCode") ?? "") || undefined,
        paymentMethod,
        paymentReference: String(formData.get("paymentReference") ?? "") || undefined,
      });

      if ("error" in result) {
        toast.error(result.error);
        return;
      }

      setOrderPlaced(true);
      clearCart();
      router.push(`/order-confirmation?orderId=${result.orderId}`);
    });
  }

  function copyInstaPayNumber() {
    navigator.clipboard.writeText(INSTAPAY_NUMBER);
    toast.success(t("numberCopied"));
  }

  if (!mounted || items.length === 0) {
    return null;
  }

  return (
    <div className="container-page py-12">
      <h1 className="mb-8 font-display text-2xl font-semibold sm:text-3xl">{t("title")}</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("contactTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" name="email" type="email" required defaultValue={session?.user?.email ?? ""} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input id="phone" name="phone" type="tel" required placeholder="01xxxxxxxxx" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("shippingTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="fullName">{t("fullName")}</Label>
                <Input id="fullName" name="fullName" required defaultValue={session?.user?.name ?? ""} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="line1">{t("line1")}</Label>
                <Input id="line1" name="line1" required />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="line2">{t("line2")}</Label>
                <Input id="line2" name="line2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">{t("city")}</Label>
                <Input id="city" name="city" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">{t("governorate")}</Label>
                <Input id="state" name="state" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="postalCode">{t("postalCode")}</Label>
                <Input id="postalCode" name="postalCode" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("paymentTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-4 text-start transition-colors",
                    paymentMethod === "COD" ? "border-primary bg-accent" : "border-input hover:border-primary"
                  )}
                >
                  <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">{t("codTitle")}</p>
                    <p className="text-xs text-muted-foreground">{t("codDesc")}</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("INSTAPAY")}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border p-4 text-start transition-colors",
                    paymentMethod === "INSTAPAY" ? "border-primary bg-accent" : "border-input hover:border-primary"
                  )}
                >
                  <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-semibold">{t("instapayTitle")}</p>
                    <p className="text-xs text-muted-foreground">{t("instapayDesc")}</p>
                  </div>
                </button>
              </div>

              {paymentMethod === "INSTAPAY" && (
                <div className="space-y-3 rounded-lg border border-primary/30 bg-accent p-4 text-accent-foreground">
                  <p className="text-sm">{t("instapayInstructions", { amount: formatPrice(estimatedTotalCents) })}</p>
                  <div className="flex items-center justify-between rounded-md bg-background px-3 py-2">
                    <span dir="ltr" className="font-mono text-base font-semibold">
                      {INSTAPAY_NUMBER}
                    </span>
                    <Button type="button" size="sm" variant="outline" onClick={copyInstaPayNumber}>
                      <Copy className="h-3.5 w-3.5" /> {t("copy")}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentReference">{t("paymentReferenceLabel")}</Label>
                    <Input
                      id="paymentReference"
                      name="paymentReference"
                      placeholder={t("paymentReferencePlaceholder")}
                    />
                    <p className="text-xs text-muted-foreground">{t("paymentReferenceHint")}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>{t("summaryTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {items.map((item) => (
                  <li key={`${item.productId}-${item.variantId}`} className="flex justify-between gap-2">
                    <span className="text-muted-foreground">
                      {item.title}
                      {item.variantLabel ? ` (${item.variantLabel})` : ""} &times; {item.quantity}
                    </span>
                    <span className="shrink-0 font-medium">{formatPrice(item.priceCents * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <Separator className="my-4" />
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("subtotal")}</span>
                  <span>{formatPrice(subtotalCents)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("shipping")}</span>
                  <span>{shippingCents === 0 ? t("free") : formatPrice(shippingCents)}</span>
                </div>
                {couponCode && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>{t("promoApplied", { code: couponCode })}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                  <span>{t("estimatedTotal")}</span>
                  <span>{formatPrice(estimatedTotalCents)}</span>
                </div>
              </div>
              <Button type="submit" size="lg" className="mt-6 w-full" disabled={isPending}>
                {isPending ? t("placingOrder") : t("placeOrder")}
              </Button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {t("editCartHint")}{" "}
                <Link href="/shop" className="underline hover:text-foreground">
                  {t("editCartLink")}
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
