import { ProductForm } from "@/components/admin/product-form";
import { getCategories } from "@/lib/data/products";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-semibold">New Product</h1>
      <ProductForm product={null} categories={categories} />
    </div>
  );
}
