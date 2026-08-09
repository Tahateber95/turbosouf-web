"use client";

import { usePathname } from "next/navigation";
import { type Locale, getT } from "@/i18n/translations";

function detectLocale(pathname: string): Locale {
  if (pathname.startsWith("/en")) return "en";
  if (pathname.startsWith("/es")) return "es";
  return "fr";
}

const LOCALE_ROOTS: Record<Locale, string> = {
  fr: "/",
  en: "/en",
  es: "/es",
};

const LOCALE_FLAGS: Record<Locale, string> = {
  fr: "🇫🇷",
  en: "🇬🇧",
  es: "🇪🇸",
};

export function LocaleSwitcher() {
  const pathname = usePathname();
  const current = detectLocale(pathname);
  const t = getT(current);

  const locales: Locale[] = ["fr", "en", "es"];

  return (
    <div className="flex items-center gap-0.5">
      {locales.map((locale) => (
        <a
          key={locale}
          href={LOCALE_ROOTS[locale]}
          title={t.localeSwitcher[locale]}
          aria-label={t.localeSwitcher[locale]}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
            locale === current
              ? "text-white bg-white/20"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          <span>{LOCALE_FLAGS[locale]}</span>
          <span>{t.localeSwitcher[locale]}</span>
        </a>
      ))}
    </div>
  );
}
