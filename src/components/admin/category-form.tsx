"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCategory, updateCategory } from "@/lib/actions/admin-categories";

type InitialCategory = {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  description: string | null;
  descriptionAr: string | null;
} | null;

export function CategoryForm({
  category,
  onSaved,
}: {
  category?: InitialCategory;
  onSaved?: () => void;
}) {
  const t = useTranslations("AdminCategories");
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        if (category) {
          await updateCategory(category.id, formData);
          toast.success(t("updated"));
        } else {
          await createCategory(formData);
          toast.success(t("created"));
          formRef.current?.reset();
        }
        onSaved?.();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("saveFailed"));
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" name="name" required defaultValue={category?.name ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nameAr">{t("nameAr")}</Label>
        <Input id="nameAr" name="nameAr" dir="rtl" defaultValue={category?.nameAr ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="slug">{t("slug")}</Label>
        <Input id="slug" name="slug" placeholder={t("slugPlaceholder")} defaultValue={category?.slug ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">{t("description")}</Label>
        <Textarea id="description" name="description" rows={2} defaultValue={category?.description ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descriptionAr">{t("descriptionAr")}</Label>
        <Textarea
          id="descriptionAr"
          name="descriptionAr"
          dir="rtl"
          rows={2}
          defaultValue={category?.descriptionAr ?? ""}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? t("saving") : category ? t("saveChanges") : t("create")}
      </Button>
    </form>
  );
}
