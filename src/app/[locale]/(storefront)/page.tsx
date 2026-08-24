import { getLocale } from "next-intl/server";

import { redirect } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function HomePage() {
  redirect({ href: "/shop", locale: (await getLocale()) as Locale });
}
