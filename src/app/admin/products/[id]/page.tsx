import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { getAdminProductById } from "@/lib/data/admin";
import { getCategories } from "@/lib/data/products";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    getAdminProductById(params.id),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-semibold">Edit Product</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
