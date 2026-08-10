"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  imgClassName,
  textClassName,
  showText = true,
  stacked = false,
}: {
  className?: string;
  imgClassName?: string;
  textClassName?: string;
  showText?: boolean;
  stacked?: boolean;
}) {
  const t = useTranslations("Meta");

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2",
        stacked && "flex-col gap-3 text-center",
        className
      )}
    >
      <Image
        src="/brand/mm-icon.png"
        alt={t("brand")}
        width={200}
        height={238}
        priority
        className={cn("h-9 w-auto shrink-0", imgClassName)}
      />
      {showText && (
        <span
          className={cn(
            "font-display text-base font-semibold leading-tight tracking-tight",
            textClassName
          )}
        >
          {t("brand")}
        </span>
      )}
    </Link>
  );
}
