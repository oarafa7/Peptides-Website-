"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Languages } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { LOCALE_META } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ variant = "icon" }: { variant?: "icon" | "full" }) {
  const t = useTranslations("Language");
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(nextLocale: string) {
    const query = searchParams.toString();
    startTransition(() => {
      router.replace(
        { pathname, query: query ? Object.fromEntries(searchParams.entries()) : undefined },
        { locale: nextLocale }
      );
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === "icon" ? "icon" : "sm"}
          aria-label={t("label")}
          disabled={isPending}
          className={cn(variant === "full" && "w-full justify-start gap-2")}
        >
          <Languages className="h-4 w-4" />
          {variant === "full" && <span>{LOCALE_META[locale as keyof typeof LOCALE_META].nativeLabel}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchTo(loc)}
            className={cn(loc === locale && "font-semibold text-primary")}
          >
            {LOCALE_META[loc].nativeLabel}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
