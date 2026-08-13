import type { Metadata } from "next";
import { Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ContactForm } from "@/components/storefront/contact-form";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Contact");
  return { title: t("title") };
}

export default async function ContactPage() {
  const t = await getTranslations("Contact");

  return (
    <div className="container-page max-w-xl py-16">
      <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{t("subtitle")}</p>
      <a
        href="tel:01271950337"
        className="mt-4 flex w-fit items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary"
      >
        <Phone className="h-4 w-4" />
        <span>{t("phoneLabel")}:</span>
        <span dir="ltr">01271950337</span>
      </a>
      <ContactForm />
    </div>
  );
}
