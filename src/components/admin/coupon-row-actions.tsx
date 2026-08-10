"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { deleteCoupon, toggleCoupon } from "@/lib/actions/admin-coupons";

export function CouponRowActions({ couponId, isActive }: { couponId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleCoupon(couponId, !isActive);
      toast.success(isActive ? "Coupon disabled" : "Coupon enabled");
    });
  }

  function handleDelete() {
    if (!confirm("Delete this coupon?")) return;
    startTransition(async () => {
      await deleteCoupon(couponId);
      toast.success("Coupon deleted");
    });
  }

  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="outline" onClick={handleToggle} disabled={isPending}>
        {isActive ? "Disable" : "Enable"}
      </Button>
      <Button size="sm" variant="outline" onClick={handleDelete} disabled={isPending}>
        Delete
      </Button>
    </div>
  );
}
