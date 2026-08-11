"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteAddress } from "@/lib/actions/account";

type Address = {
  id: string;
  fullName: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string | null;
  country: string;
  isDefault: boolean;
};

export function AddressList({ addresses }: { addresses: Address[] }) {
  const t = useTranslations("Addresses");
  const [isPending, startTransition] = useTransition();

  if (addresses.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("noAddresses")}</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {addresses.map((address) => (
        <div key={address.id} className="rounded-lg border p-4 text-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-semibold">{address.fullName}</p>
            {address.isDefault && <Badge variant="secondary">{t("default")}</Badge>}
          </div>
          <p className="text-muted-foreground">{address.line1}</p>
          {address.line2 && <p className="text-muted-foreground">{address.line2}</p>}
          <p className="text-muted-foreground">
            {address.city}
            {address.state ? `, ${address.state}` : ""}
            {address.postalCode ? ` ${address.postalCode}` : ""}
          </p>
          <p className="text-muted-foreground">{address.country}</p>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await deleteAddress(address.id);
                toast.success(t("removed"));
              })
            }
          >
            {t("remove")}
          </Button>
        </div>
      ))}
    </div>
  );
}
