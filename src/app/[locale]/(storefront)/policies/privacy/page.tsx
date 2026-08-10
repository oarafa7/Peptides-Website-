import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Policies");
  return { title: t("privacyTitle") };
}

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("Policies");

  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="font-display text-3xl font-semibold">{t("privacyTitle")}</h1>
      <div className="prose prose-neutral mt-6 space-y-4 text-sm text-muted-foreground">
        <p>{t("privacyP1")}</p>
        <p>{t("privacyP2")}</p>
        <p>{t("privacyP3")}</p>
      </div>
    </div>
  );
}
