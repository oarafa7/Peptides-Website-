"use client";

import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function AdminSignOut() {
  const t = useTranslations("Admin");

  return (
    <Button variant="outline" size="sm" className="w-full" onClick={() => signOut({ callbackUrl: "/" })}>
      {t("signOut")}
    </Button>
  );
}
