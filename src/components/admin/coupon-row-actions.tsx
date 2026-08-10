"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { deleteCoupon, toggleCoupon } from "@/lib/actions/admin-coupons";

export function CouponRowActions({ couponId, isActive }: { couponId: string; isActive: boolean }) {
  const t = useTranslations("AdminCoupons");
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleCoupon(couponId, !isActive);
      toast.success(isActive ? t("disabledToast") : t("enabled"));
    });
  }

  function handleDelete() {
    if (!confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      await deleteCoupon(couponId);
      toast.success(t("deleted"));
    });
  }

  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="outline" onClick={handleToggle} disabled={isPending}>
        {isActive ? t("disable") : t("enable")}
      </Button>
      <Button size="sm" variant="outline" onClick={handleDelete} disabled={isPending}>
        {t("delete")}
      </Button>
    </div>
  );
}
