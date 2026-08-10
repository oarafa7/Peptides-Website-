import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping & Returns" };

export default function ShippingPolicyPage() {
  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="font-display text-3xl font-semibold">Shipping &amp; Returns</h1>
      <div className="prose prose-neutral mt-6 space-y-4 text-sm text-muted-foreground">
        <p>
          Orders ship within 1-2 business days via insulated, cold-chain courier. Standard
          shipping typically arrives within 2-5 business days.
        </p>
        <p>
          Because our products are temperature-sensitive research compounds, we accept
          returns only on unopened, sealed vials within 30 days of delivery. Damaged or
          incorrect items are replaced free of charge — contact us with your order number
          and photos of the shipment.
        </p>
        <p>
          Refunds are issued to the original payment method within 5-10 business days of
          the return being received and inspected.
        </p>
      </div>
    </div>
  );
}
