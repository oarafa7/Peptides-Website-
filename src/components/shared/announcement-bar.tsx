import { useTranslations } from "next-intl";

export function AnnouncementBar() {
  const t = useTranslations("Announcement");

  return (
    <div className="bg-ink-950 py-2 text-center text-xs font-medium tracking-wide text-white">
      {t("text")}
    </div>
  );
}
