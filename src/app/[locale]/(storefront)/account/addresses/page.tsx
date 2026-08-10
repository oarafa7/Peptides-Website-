import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressForm } from "@/components/storefront/address-form";
import { AddressList } from "@/components/storefront/address-list";
import { authOptions } from "@/lib/auth";
import { getAddressesForUser } from "@/lib/data/account";

export default async function AccountAddressesPage() {
  const [session, t] = await Promise.all([getServerSession(authOptions), getTranslations("Addresses")]);
  const addresses = session?.user?.id ? await getAddressesForUser(session.user.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("savedAddresses")}</CardTitle>
        </CardHeader>
        <CardContent>
          <AddressList addresses={addresses} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("addNew")}</CardTitle>
        </CardHeader>
        <CardContent>
          <AddressForm />
        </CardContent>
      </Card>
    </div>
  );
}
