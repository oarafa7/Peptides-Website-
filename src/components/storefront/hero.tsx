import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative overflow-hidden bg-ink-950">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(24,180,126,0.35), transparent 40%), radial-gradient(circle at 80% 60%, rgba(24,180,126,0.25), transparent 45%)",
        }}
      />
      <div className="container-page relative flex min-h-[560px] flex-col items-start justify-center py-24 text-white">
        <span className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-brand-300">
          {t("badge")}
        </span>
        <h1 className="max-w-2xl text-start font-display text-4xl font-semibold leading-tight sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-6 max-w-lg text-start text-base text-white/70 sm:text-lg">{t("description")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button size="lg" asChild>
            <Link href="/shop">
              {t("shopAll")} <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white" asChild>
            <Link href="/about">{t("learnMore")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
