"use client";

import { useRef, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { upsertAddress } from "@/lib/actions/account";

export function AddressForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await upsertAddress(formData);
      toast.success("Address saved");
      formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" required />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="line1">Address line 1</Label>
        <Input id="line1" name="line1" required />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="line2">Address line 2</Label>
        <Input id="line2" name="line2" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input id="state" name="state" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="postalCode">Postal code</Label>
        <Input id="postalCode" name="postalCode" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <Input id="country" name="country" defaultValue="US" required />
      </div>
      <div className="space-y-2 sm:col-span-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" />
      </div>
      <div className="flex items-center gap-3 sm:col-span-2">
        <Switch id="isDefault" name="isDefault" />
        <Label htmlFor="isDefault">Set as default address</Label>
      </div>
      <Button type="submit" disabled={isPending} className="sm:col-span-2">
        {isPending ? "Saving..." : "Save address"}
      </Button>
    </form>
  );
}
