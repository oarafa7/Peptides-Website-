import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/shared/logo";

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");

  return (
    <footer className="mt-24 border-t bg-muted/30">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Logo imgClassName="h-11" textClassName="text-lg" />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t("shop")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/shop" className="hover:text-foreground">{tNav("shopAll")}</Link></li>
            <li><Link href="/collections/recovery-repair" className="hover:text-foreground">{t("recoveryRepair")}</Link></li>
            <li><Link href="/collections/longevity" className="hover:text-foreground">{t("longevity")}</Link></li>
            <li><Link href="/collections/metabolic" className="hover:text-foreground">{t("metabolic")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t("company")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">{t("aboutUs")}</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">{t("contact")}</Link></li>
            <li><Link href="/account/orders" className="hover:text-foreground">{t("trackOrder")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t("legal")}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/policies/shipping" className="hover:text-foreground">{t("shippingReturns")}</Link></li>
            <li><Link href="/policies/privacy" className="hover:text-foreground">{t("privacyPolicy")}</Link></li>
            <li><Link href="/policies/terms" className="hover:text-foreground">{t("termsOfService")}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6">
        <p className="container-page text-center text-xs text-muted-foreground">
          {t("copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
