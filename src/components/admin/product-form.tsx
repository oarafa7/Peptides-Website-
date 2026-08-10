"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
import { ImageUploadInput } from "@/components/admin/image-upload-input";
import { useRouter } from "@/i18n/navigation";
import { upsertProduct, type ProductFormInput } from "@/lib/actions/admin-products";

type Category = { id: string; name: string };

type InitialProduct = {
  id: string;
  title: string;
  description: string;
  titleAr: string | null;
  descriptionAr: string | null;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  priceCents: number;
  compareAtCents: number | null;
  categoryId: string | null;
  tags: string[];
  materials: string | null;
  materialsAr: string | null;
  shippingReturns: string | null;
  shippingReturnsAr: string | null;
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
  const t = useTranslations("AdminProductForm");
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
      titleAr: String(formData.get("titleAr") ?? ""),
      descriptionAr: String(formData.get("descriptionAr") ?? ""),
      status: formData.get("status") as ProductFormInput["status"],
      priceCents: Math.round(Number(formData.get("price") ?? 0) * 100),
      compareAtCents: formData.get("compareAt")
        ? Math.round(Number(formData.get("compareAt")) * 100)
        : undefined,
      categoryId: (formData.get("categoryId") as string) || undefined,
      tags: String(formData.get("tags") ?? ""),
      materials: String(formData.get("materials") ?? ""),
      materialsAr: String(formData.get("materialsAr") ?? ""),
      shippingReturns: String(formData.get("shippingReturns") ?? ""),
      shippingReturnsAr: String(formData.get("shippingReturnsAr") ?? ""),
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
        toast.error(t("saveFailed"));
        console.error(err);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("general")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("title")}</Label>
            <Input id="title" name="title" required defaultValue={product?.title} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea id="description" name="description" rows={5} required defaultValue={product?.description} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">{t("status")}</Label>
              <Select name="status" defaultValue={product?.status ?? "DRAFT"}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">{t("statusDraft")}</SelectItem>
                  <SelectItem value="ACTIVE">{t("statusActive")}</SelectItem>
                  <SelectItem value="ARCHIVED">{t("statusArchived")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="categoryId">{t("category")}</Label>
              <Select name="categoryId" defaultValue={product?.categoryId ?? undefined}>
                <SelectTrigger id="categoryId">
                  <SelectValue placeholder={t("categoryNone")} />
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
              <Label htmlFor="price">{t("price")}</Label>
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
              <Label htmlFor="compareAt">{t("compareAt")}</Label>
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
            <Label htmlFor="tags">{t("tags")}</Label>
            <Input id="tags" name="tags" defaultValue={product?.tags.join(", ")} placeholder="bestseller, new" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="materials">{t("materials")}</Label>
            <Textarea id="materials" name="materials" rows={2} defaultValue={product?.materials ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingReturns">{t("shippingReturns")}</Label>
            <Textarea
              id="shippingReturns"
              name="shippingReturns"
              rows={2}
              defaultValue={product?.shippingReturns ?? ""}
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch id="isFeatured" name="isFeatured" defaultChecked={product?.isFeatured} />
            <Label htmlFor="isFeatured">{t("featured")}</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="trackInventory" name="trackInventory" defaultChecked={product?.trackInventory ?? true} />
            <Label htmlFor="trackInventory">{t("trackInventory")}</Label>
          </div>
          {variants.length === 0 && (
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">{t("stockQuantity")}</Label>
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
        <CardHeader>
          <CardTitle>{t("arabicSection")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" dir="rtl">
          <div className="space-y-2">
            <Label htmlFor="titleAr">{t("titleAr")}</Label>
            <Input id="titleAr" name="titleAr" defaultValue={product?.titleAr ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descriptionAr">{t("descriptionAr")}</Label>
            <Textarea id="descriptionAr" name="descriptionAr" rows={5} defaultValue={product?.descriptionAr ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="materialsAr">{t("materialsAr")}</Label>
            <Textarea id="materialsAr" name="materialsAr" rows={2} defaultValue={product?.materialsAr ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shippingReturnsAr">{t("shippingReturnsAr")}</Label>
            <Textarea
              id="shippingReturnsAr"
              name="shippingReturnsAr"
              rows={2}
              defaultValue={product?.shippingReturnsAr ?? ""}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("variantsTitle")}</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={addVariant}>
            <Plus className="h-4 w-4" /> {t("addVariant")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {variants.length === 0 && <p className="text-sm text-muted-foreground">{t("noVariants")}</p>}
          {variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-1 gap-2 rounded-md border p-3 sm:grid-cols-6">
              <Input
                placeholder={t("variantNamePlaceholder")}
                value={variant.name}
                onChange={(e) =>
                  setVariants((v) => v.map((row, i) => (i === index ? { ...row, name: e.target.value } : row)))
                }
                className="sm:col-span-2"
              />
              <Input
                placeholder={t("optionPlaceholder")}
                value={variant.option1Name}
                onChange={(e) =>
                  setVariants((v) =>
                    v.map((row, i) => (i === index ? { ...row, option1Name: e.target.value } : row))
                  )
                }
              />
              <Input
                placeholder={t("valuePlaceholder")}
                value={variant.option1Value}
                onChange={(e) =>
                  setVariants((v) =>
                    v.map((row, i) => (i === index ? { ...row, option1Value: e.target.value } : row))
                  )
                }
              />
              <Input
                placeholder={t("priceOverridePlaceholder")}
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
                  placeholder={t("stockPlaceholder")}
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
          <CardTitle>{t("imagesTitle")}</CardTitle>
          <Button type="button" size="sm" variant="outline" onClick={addImage}>
            <Plus className="h-4 w-4" /> {t("addImage")}
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">{t("imagesHint")}</p>
          {images.map((image, index) => (
            <div key={index} className="flex gap-2">
              <ImageUploadInput
                value={image.url}
                onUploaded={(url) =>
                  setImages((i) => i.map((row, idx) => (idx === index ? { ...row, url } : row)))
                }
              />
              <Input
                placeholder="https://..."
                value={image.url}
                onChange={(e) =>
                  setImages((i) => i.map((row, idx) => (idx === index ? { ...row, url: e.target.value } : row)))
                }
              />
              <Input
                placeholder={t("altTextPlaceholder")}
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
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
