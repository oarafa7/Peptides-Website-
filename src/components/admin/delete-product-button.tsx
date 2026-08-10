"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions/admin-products";

export function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteProduct(productId);
        toast.success("Product deleted");
      } catch {
        toast.error("Failed to delete product");
      }
    });
  }

  return (
    <Button size="sm" variant="outline" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
