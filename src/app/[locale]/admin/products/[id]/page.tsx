import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { ProductForm } from "@/components/admin/product-form";
import type { Locale } from "@/i18n/routing";
import { getAdminProductById } from "@/lib/data/admin";
import { getCategories } from "@/lib/data/products";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const locale = (await getLocale()) as Locale;
  const [product, categories, t] = await Promise.all([
    getAdminProductById(params.id),
    getCategories(locale),
    getTranslations("AdminProducts"),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-semibold">{t("editProduct")}</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
