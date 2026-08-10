import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Policies");
  return { title: t("shippingTitle") };
}

export default async function ShippingPolicyPage() {
  const t = await getTranslations("Policies");

  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="font-display text-3xl font-semibold">{t("shippingTitle")}</h1>
      <div className="prose prose-neutral mt-6 space-y-4 text-sm text-muted-foreground">
        <p>{t("shippingP1")}</p>
        <p>{t("shippingP2")}</p>
        <p>{t("shippingP3")}</p>
      </div>
    </div>
  );
}
