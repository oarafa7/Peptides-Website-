import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAllOrders } from "@/lib/data/admin";
import { formatOrderNumber, formatPrice } from "@/lib/utils";
import { OrderStatusFilter } from "@/components/admin/order-status-filter";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "success" | "destructive"> = {
  PENDING: "secondary",
  PAID: "default",
  UNFULFILLED: "secondary",
  FULFILLED: "success",
  SHIPPED: "success",
  DELIVERED: "success",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const orders = await getAllOrders(searchParams.status);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Orders</h1>
          <p className="text-sm text-muted-foreground">{orders.length} orders</p>
        </div>
        <OrderStatusFilter current={searchParams.status} />
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link href={`/admin/orders/${order.id}`} className="font-medium hover:underline">
                    {formatOrderNumber(order.id)}
                  </Link>
                </TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[order.status] ?? "secondary"}>{order.status}</Badge>
                </TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell className="text-right">{formatPrice(order.totalCents)}</TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {order.createdAt.toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
