"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("AdminCoupons");
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await createCoupon(formData);
        toast.success(t("created"));
        formRef.current?.reset();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("createFailed"));
      }
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="code">{t("code")}</Label>
        <Input id="code" name="code" required placeholder="SUMMER20" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="type">{t("type")}</Label>
        <Select name="type" defaultValue="PERCENTAGE">
          <SelectTrigger id="type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PERCENTAGE">{t("percentageOff")}</SelectItem>
            <SelectItem value="FIXED_AMOUNT">{t("fixedAmountOff")}</SelectItem>
            <SelectItem value="FREE_SHIPPING">{t("freeShipping")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="value">{t("value")}</Label>
        <Input id="value" name="value" type="number" min="0" defaultValue={0} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="minSubtotalCents">{t("minSubtotal")}</Label>
        <Input id="minSubtotalCents" name="minSubtotalCents" type="number" min="0" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="usageLimit">{t("usageLimit")}</Label>
        <Input id="usageLimit" name="usageLimit" type="number" min="1" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiresAt">{t("expiresAt")}</Label>
        <Input id="expiresAt" name="expiresAt" type="date" />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? t("creating") : t("create")}
      </Button>
    </form>
  );
}
