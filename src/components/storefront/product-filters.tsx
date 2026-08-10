"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { formatPrice } from "@/lib/utils";

type Category = { id: string; name: string; slug: string };

export function ProductFilters({
  categories,
  priceBounds,
  hideCategory,
}: {
  categories: Category[];
  priceBounds: { min: number; max: number };
  hideCategory?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [price, setPrice] = useState<[number, number]>([
    Number(searchParams.get("min") ?? priceBounds.min),
    Number(searchParams.get("max") ?? priceBounds.max),
  ]);

  function updateParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  const activeCategory = searchParams.get("category");
  const inStockOnly = searchParams.get("inStock") === "1";
  const sort = searchParams.get("sort") ?? "newest";

  return (
    <div className="space-y-8">
      <div>
        <Label className="mb-3 block text-sm font-semibold">Sort by</Label>
        <Select
          value={sort}
          onValueChange={(value) => updateParams((p) => p.set("sort", value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!hideCategory && (
        <div>
          <Label className="mb-3 block text-sm font-semibold">Category</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={activeCategory === category.slug}
                  onCheckedChange={(checked) =>
                    updateParams((p) => {
                      if (checked) p.set("category", category.slug);
                      else p.delete("category");
                    })
                  }
                />
                {category.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <Label className="mb-3 block text-sm font-semibold">Price</Label>
        <Slider
          min={priceBounds.min}
          max={priceBounds.max}
          step={100}
          value={price}
          onValueChange={(value) => setPrice(value as [number, number])}
          onValueCommit={(value) =>
            updateParams((p) => {
              p.set("min", String(value[0]));
              p.set("max", String(value[1]));
            })
          }
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(price[0])}</span>
          <span>{formatPrice(price[1])}</span>
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={inStockOnly}
            onCheckedChange={(checked) =>
              updateParams((p) => {
                if (checked) p.set("inStock", "1");
                else p.delete("inStock");
              })
            }
          />
          In stock only
        </label>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="w-full"
        disabled={isPending}
        onClick={() => router.push(pathname)}
      >
        Clear filters
      </Button>
    </div>
  );
}
