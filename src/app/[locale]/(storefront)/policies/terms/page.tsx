import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Policies");
  return { title: t("termsTitle") };
}

export default async function TermsPage() {
  const t = await getTranslations("Policies");

  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="font-display text-3xl font-semibold">{t("termsTitle")}</h1>
      <div className="prose prose-neutral mt-6 space-y-4 text-sm text-muted-foreground">
        <p>{t("termsP1")}</p>
        <p>{t("termsP2")}</p>
        <p>{t("termsP3")}</p>
      </div>
    </div>
  );
}
