"use client";

import { SessionProvider } from "next-auth/react";
import { useLocale } from "next-intl";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <SessionProvider>
      {children}
      <Toaster
        position={locale === "ar" ? "bottom-left" : "bottom-right"}
        dir={dir}
        richColors
        closeButton
      />
    </SessionProvider>
  );
}
