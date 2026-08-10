import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Nav");
  return { title: t("about") };
}

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <div className="container-page max-w-3xl py-16">
      <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
      <div className="prose prose-neutral mt-6 space-y-4 text-muted-foreground">
        <p>{t("p1")}</p>
        <p>{t("p2")}</p>
        <p className="font-medium text-foreground">{t("p3")}</p>
      </div>
    </div>
  );
}
