"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/components/admin/category-form";
import { deleteCategory } from "@/lib/actions/admin-categories";

type Category = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  description: string | null;
  descriptionAr: string | null;
};

export function CategoryRowActions({ category }: { category: Category }) {
  const t = useTranslations("AdminCategories");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      try {
        await deleteCategory(category.id);
        toast.success(t("deleted"));
      } catch {
        toast.error(t("deleteFailed"));
      }
    });
  }

  return (
    <div className="flex justify-end gap-2">
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <Button size="sm" variant="outline" onClick={() => setIsEditOpen(true)}>
          {t("edit")}
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editCategory")}</DialogTitle>
          </DialogHeader>
          <CategoryForm category={category} onSaved={() => setIsEditOpen(false)} />
        </DialogContent>
      </Dialog>
      <Button size="sm" variant="outline" onClick={handleDelete} disabled={isPending}>
        {t("delete")}
      </Button>
    </div>
  );
}
