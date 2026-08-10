import { getLocale, getTranslations } from "next-intl/server";

import { ProductForm } from "@/components/admin/product-form";
import type { Locale } from "@/i18n/routing";
import { getCategories } from "@/lib/data/products";

export default async function NewProductPage() {
  const locale = (await getLocale()) as Locale;
  const [categories, t] = await Promise.all([getCategories(locale), getTranslations("AdminProducts")]);

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-semibold">{t("newProduct")}</h1>
      <ProductForm product={null} categories={categories} />
    </div>
  );
}
