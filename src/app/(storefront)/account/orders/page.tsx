import Link from "next/link";
import { getServerSession } from "next-auth";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { authOptions } from "@/lib/auth";
import { getOrdersForUser } from "@/lib/data/account";
import { formatOrderNumber, formatPrice } from "@/lib/utils";

export default async function AccountOrdersPage() {
  const session = await getServerSession(authOptions);
  const orders = session?.user?.id ? await getOrdersForUser(session.user.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Order History</h1>
        <p className="text-sm text-muted-foreground">{orders.length} orders</p>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">You haven&apos;t placed any orders yet.</p>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link href={`/account/orders/${order.id}`} className="font-medium hover:underline">
                      {formatOrderNumber(order.id)}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{order.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatPrice(order.totalCents)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
