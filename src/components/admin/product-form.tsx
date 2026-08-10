"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { upsertProduct, type ProductFormInput } from "@/lib/actions/admin-products";

type Category = { id: string; name: string };

type InitialProduct = {
  id: string;
  title: string;
  description: string;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  priceCents: number;
  compareAtCents: number | null;
  categoryId: string | null;
  tags: string[];
  materials: string | null;
  shippingReturns: string | null;
  isFeatured: boolean;
  trackInventory: boolean;
  stockQuantity: number;
  variants: {
    id: string;
    name: string;
    option1Name: string | null;
    option1Value: string | null;
    priceCents: number | null;
    stockQuantity: number;
  }[];
  images: { id: string; url: string; altText: string | null }[];
} | null;

type VariantRow = {
  id?: string;
  name: string;
  option1Name: string;
  option1Value: string;
  priceCents: string;
  stockQuantity: string;
};

type ImageRow = { id?: string; url: string; altText: string };

export function ProductForm({ product, categories }: { product: InitialProduct; categories: Category[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants.map((v) => ({
      id: v.id,
      name: v.name,
      option1Name: v.option1Name ?? "",
      option1Value: v.option1Value ?? "",
      priceCents: v.priceCents != null ? String(v.priceCents / 100) : "",
      stockQuantity: String(v.stockQuantity),
    })) ?? []
  );
  const [images, setImages] = useState<ImageRow[]>(
    product?.images.map((i) => ({ id: i.id, url: i.url, altText: i.altText ?? "" })) ?? []
  );

  function addVariant() {
    setVariants((v) => [
      ...v,
      { name: "", option1Name: "Size", option1Value: "", priceCents: "", stockQuantity: "0" },
    ]);
  }
  function removeVariant(index: number) {
    setVariants((v) => v.filter((_, i) => i !== index));
  }
  function addImage() {
    setImages((i) => [...i, { url: "", altText: "" }]);
  }
  function removeImage(index: number) {
    setImages((i) => i.filter((_, idx) => idx !== index));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const input: ProductFormInput = {
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
      status: formData.get("status") as ProductFormInput["status"],
      priceCents: Math.round(Number(formData.get("price") ?? 0) * 100),
      compareAtCents: formData.get("compareAt")
        ? Math.round(Number(formData.get("compareAt")) * 100)
        : undefined,
      categoryId: (formData.get("categoryId") as string) || undefined,
      tags: String(formData.get("tags") ?? ""),
      materials: String(formData.get("materials") ?? ""),
      shippingReturns: String(formData.get("shippingReturns") ?? ""),
      isFeatured: formData.get("isFeatured") === "on",
      trackInventory: formData.get("trackInventory") !== "off",
      stockQuantity: Number(formData.get("stockQuantity") ?? 0),
      variants: variants
        .filter((v) => v.name.trim())
        .map((v) => ({
          id: v.id,
          name: v.name,
          option1Name: v.option1Name || undefined,
          option1Value: v.option1Value || undefined,
          priceCents: v.priceCents ? Math.round(Number(v.priceCents) * 100) : undefined,
          stockQuantity: Number(v.stockQuantity || 0),
        })),
      images: images
        .filter((i) => i.url.trim())
        .map((i) => ({ id: i.id, url: i.url, altText: i.altText || undefined })),
    };

    startTransition(async () => {
      try {
        await upsertProduct(product?.id ?? null, input);
      } catch (err) {
        if (err instanceof Error && err.message === "NEXT_REDIRECT") {
          return;
        }
        toast.error("Failed to save product");
        console.error(err);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required defaultValue={product?.title} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={5} required defaultValue={product?.description} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={product?.status ?? "DRAFT"}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <Select name="categoryId" defaultValue={product?.categoryId ?? undefined}>
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={product ? (product.priceCents / 100).toFixed(2) : undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compareAt">Compare-at price ($)</Label>
              <Input
                id="compareAt"
                name="compareAt"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.compareAtCents ? (product.compareAtCents / 100).toFixed(2) : undefined}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" name="tags" defaultValue={product?.tags.join(", ")} placeholder="bestseller, new" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="materials">Materials / Details</Label>
            <Textarea id="materials" name="materials" rows={2} defaultValue={product?.materials ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingReturns">Shipping &amp; Returns</Label>
            <Textarea
              id="shippingReturns"
              name="shippingReturns"
              rows={2}
              defaultValue={product?.shippingReturns ?? ""}
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="isFeatured" name="isFeatured" defaultChecked={product?.isFeatured} />
            <Label htmlFor="isFeatured">Featured product</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="trackInventory" name="trackInventory" defaultChecked={product?.trackInventory ?? true} />
            <Label htmlFor="trackInventory">Track inventory</Label>
          </div>
          {variants.length === 0 && (
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock quantity</Label>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                defaultValue={product?.stockQuantity ?? 0}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Variants</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={addVariant}>
            <Plus className="h-4 w-4" /> Add variant
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {variants.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No variants — this product will use the base price and stock quantity above.
            </p>
          )}
          {variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 rounded-md border p-3 sm:grid-cols-6">
              <Input
                placeholder="Variant name (e.g. 5mg)"
                value={variant.name}
                onChange={(e) =>
                  setVariants((v) => v.map((row, i) => (i === index ? { ...row, name: e.target.value } : row)))
                }
                className="sm:col-span-2"
              />
              <Input
                placeholder="Option (e.g. Size)"
                value={variant.option1Name}
                onChange={(e) =>
                  setVariants((v) =>
                    v.map((row, i) => (i === index ? { ...row, option1Name: e.target.value } : row))
                  )
                }
              />
              <Input
                placeholder="Value (e.g. 5mg)"
                value={variant.option1Value}
                onChange={(e) =>
                  setVariants((v) =>
                    v.map((row, i) => (i === index ? { ...row, option1Value: e.target.value } : row))
                  )
                }
              />
              <Input
                placeholder="Price override ($)"
                type="number"
                step="0.01"
                value={variant.priceCents}
                onChange={(e) =>
                  setVariants((v) =>
                    v.map((row, i) => (i === index ? { ...row, priceCents: e.target.value } : row))
                  )
                }
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Stock"
                  type="number"
                  min="0"
                  value={variant.stockQuantity}
                  onChange={(e) =>
                    setVariants((v) =>
                      v.map((row, i) => (i === index ? { ...row, stockQuantity: e.target.value } : row))
                    )
                  }
                />
                <Button type="button" size="icon" variant="ghost" onClick={() => removeVariant(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Images</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={addImage}>
            <Plus className="h-4 w-4" /> Add image
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Paste hosted image URLs (e.g. from Cloudinary, S3, or Unsplash). Direct upload requires
            configuring Cloudinary/S3 credentials.
          </p>
          {images.map((image, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="https://..."
                value={image.url}
                onChange={(e) =>
                  setImages((i) => i.map((row, idx) => (idx === index ? { ...row, url: e.target.value } : row)))
                }
              />
              <Input
                placeholder="Alt text"
                value={image.altText}
                onChange={(e) =>
                  setImages((i) =>
                    i.map((row, idx) => (idx === index ? { ...row, altText: e.target.value } : row))
                  )
                }
              />
              <Button type="button" size="icon" variant="ghost" onClick={() => removeImage(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save product"}
        </Button>
      </div>
    </form>
  );
}
