"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions/admin-products";

export function DeleteProductButton({ productId }: { productId: string }) {
  const t = useTranslations("AdminProducts");
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      try {
        await deleteProduct(productId);
        toast.success(t("deleted"));
      } catch {
        toast.error(t("deleteFailed"));
      }
    });
  }

  return (
    <Button size="sm" variant="outline" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
