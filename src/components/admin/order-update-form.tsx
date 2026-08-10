"use client";

import { useTransition } from "react";
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
import { updateOrder } from "@/lib/actions/admin-orders";

const STATUSES = ["PENDING", "PAID", "UNFULFILLED", "FULFILLED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export function OrderUpdateForm({
  orderId,
  status,
  trackingNumber,
  trackingCarrier,
}: {
  orderId: string;
  status: string;
  trackingNumber: string | null;
  trackingCarrier: string | null;
}) {
  const t = useTranslations("AdminOrderDetail");
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await updateOrder({
          orderId,
          status: formData.get("status") as never,
          trackingNumber: String(formData.get("trackingNumber") ?? ""),
          trackingCarrier: String(formData.get("trackingCarrier") ?? ""),
        });
        toast.success(t("updated"));
      } catch {
        toast.error(t("updateFailed"));
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="status">{t("statusLabel")}</Label>
        <Select name="status" defaultValue={status}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="trackingCarrier">{t("carrierLabel")}</Label>
        <Input
          id="trackingCarrier"
          name="trackingCarrier"
          defaultValue={trackingCarrier ?? ""}
          placeholder={t("carrierPlaceholder")}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="trackingNumber">{t("trackingLabel")}</Label>
        <Input id="trackingNumber" name="trackingNumber" defaultValue={trackingNumber ?? ""} />
      </div>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
