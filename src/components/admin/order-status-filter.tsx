"use client";

import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "@/i18n/navigation";

const STATUSES = ["PENDING", "PAID", "UNFULFILLED", "FULFILLED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export function OrderStatusFilter({ current }: { current?: string }) {
  const t = useTranslations("AdminOrders");
  const router = useRouter();

  return (
    <Select
      value={current ?? "ALL"}
      onValueChange={(value) => router.push(value === "ALL" ? "/admin/orders" : `/admin/orders?status=${value}`)}
    >
      <SelectTrigger className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">{t("allStatuses")}</SelectItem>
        {STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
