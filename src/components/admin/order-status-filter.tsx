"use client";

import { useRouter } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUSES = ["PENDING", "PAID", "UNFULFILLED", "FULFILLED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export function OrderStatusFilter({ current }: { current?: string }) {
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
        <SelectItem value="ALL">All statuses</SelectItem>
        {STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
