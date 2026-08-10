"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function AdminSignOut() {
  return (
    <Button variant="outline" size="sm" className="w-full" onClick={() => signOut({ callbackUrl: "/" })}>
      Sign out
    </Button>
  );
}
