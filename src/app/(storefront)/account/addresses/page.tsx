import { getServerSession } from "next-auth";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressForm } from "@/components/storefront/address-form";
import { AddressList } from "@/components/storefront/address-list";
import { authOptions } from "@/lib/auth";
import { getAddressesForUser } from "@/lib/data/account";

export default async function AccountAddressesPage() {
  const session = await getServerSession(authOptions);
  const addresses = session?.user?.id ? await getAddressesForUser(session.user.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Addresses</h1>
        <p className="text-sm text-muted-foreground">Manage your saved shipping addresses.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saved Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <AddressList addresses={addresses} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Address</CardTitle>
        </CardHeader>
        <CardContent>
          <AddressForm />
        </CardContent>
      </Card>
    </div>
  );
}
