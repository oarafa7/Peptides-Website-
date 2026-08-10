"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/storefront/product-grid";
import { useWishlist } from "@/lib/store/wishlist";
import type { ProductWithRelations } from "@/lib/data/products";

export default function WishlistPage() {
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
    fetch(`/api/products/by-ids?ids=${productIds.join(",")}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products ?? []))
      .finally(() => setLoading(false));
  }, [productIds]);

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-semibold">Wishlist</h1>
      <p className="mt-1 text-sm text-muted-foreground">Items you&apos;ve saved for later.</p>

      <div className="mt-8">
        {!loading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Heart className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Your wishlist is empty.</p>
            <Button asChild variant="outline">
              <Link href="/shop">Browse products</Link>
            </Button>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}
