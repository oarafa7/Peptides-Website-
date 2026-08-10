"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/store/cart";

export default function CartPage() {
  const t = useTranslations("Cart");
  const open = useCart((s) => s.open);

  useEffect(() => {
    open();
  }, [open]);

  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
      <p className="text-sm text-muted-foreground">{t("cartOpen")}</p>
      <Button asChild variant="outline">
        <Link href="/shop">{t("continueShopping")}</Link>
      </Button>
    </div>
  );
}
