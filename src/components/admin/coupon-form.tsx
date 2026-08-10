"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCoupon } from "@/lib/actions/admin-coupons";

export function CouponForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createCoupon(formData);
        toast.success("Coupon created");
        formRef.current?.reset();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to create coupon");
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">Code</Label>
        <Input id="code" name="code" required placeholder="SUMMER20" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select name="type" defaultValue="PERCENTAGE">
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERCENTAGE">Percentage off</SelectItem>
            <SelectItem value="FIXED_AMOUNT">Fixed amount off</SelectItem>
            <SelectItem value="FREE_SHIPPING">Free shipping</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="value">Value (% or cents)</Label>
        <Input id="value" name="value" type="number" min="0" defaultValue={0} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="minSubtotalCents">Minimum subtotal (cents)</Label>
        <Input id="minSubtotalCents" name="minSubtotalCents" type="number" min="0" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="usageLimit">Usage limit</Label>
        <Input id="usageLimit" name="usageLimit" type="number" min="1" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiresAt">Expires at</Label>
        <Input id="expiresAt" name="expiresAt" type="date" />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating..." : "Create coupon"}
      </Button>
    </form>
  );
}
