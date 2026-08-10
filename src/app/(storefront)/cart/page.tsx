"use client";

import { useEffect } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/store/cart";

export default function CartPage() {
  const open = useCart((s) => s.open);

  useEffect(() => {
    open();
  }, [open]);

  return (
    <div className="container-page flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="font-display text-2xl font-semibold">Your Cart</h1>
      <p className="text-sm text-muted-foreground">Your cart is open in the drawer.</p>
      <Button asChild variant="outline">
        <Link href="/shop">Continue shopping</Link>
      </Button>
    </div>
  );
}
