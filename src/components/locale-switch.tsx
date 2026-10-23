"use client";

import BR from "country-flag-icons/react/3x2/BR";
import ES from "country-flag-icons/react/3x2/ES";
import US from "country-flag-icons/react/3x2/US";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { localeHref, locales, stripLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

/**
 * A flag stands for a language here, not a country, so each one is a choice:
 * the United States for English, Brazil for Portuguese, Spain for Spanish. A
 * locale with no flag falls back to its code, so adding one never breaks the
 * switch.
 */
const flags: Partial<Record<string, ComponentType<{ className?: string; title?: string }>>> = {
  en: US,
  pt: BR,
  es: ES,
};

export function LocaleSwitch({
  locale,
  labels,
}: {
  locale: Locale;
  labels: Dictionary["locale"];
}) {
  /**
   * The current path has to be stripped before it can be rebuilt in another
   * locale. Swapping the first segment would work only if every locale carried
   * a prefix; the default one does not, so `/projects` would become `/pt` and
   * lose the page.
   */
  const path = stripLocale(usePathname() ?? "/");

  return (
    <div
      role="group"
      aria-label={labels.group}
      className="flex items-center gap-1.5"
    >
      {locales.map((code) => {
        const active = code === locale;
        return (
          /**
           * A plain anchor, not <Link>: switching locale changes a root
           * parameter, so a client navigation re-renders the root layout — and
           * React refuses to run the theme <script> during a client render,
           * warning about it in development. A document navigation also lets
           * the server read the cookie written just below on the next request.
           */
          <a
            key={code}
            href={localeHref(code, path)}
            hrefLang={code}
            aria-current={active ? "true" : undefined}
            onClick={() => {
              // The proxy only reads this cookie. Choosing here is the one
              // moment a reader actually states a preference.
              document.cookie = `NEXT_LOCALE=${code};path=/;max-age=31536000;samesite=lax`;
            }}
            aria-label={labels[code]}
            title={labels[code]}
            className={`flex h-8 items-center px-1 transition-opacity ${
              active ? "opacity-100" : "opacity-45 hover:opacity-100"
            }`}
          >
            {(() => {
              const Flag = flags[code];
              return Flag ? (
                <Flag
                  aria-hidden="true"
                  className={`block h-4 w-6 ${active ? "outline-2 outline-offset-2 outline-foreground" : ""}`}
                />
              ) : (
                <span className="data text-xs">{code.toUpperCase()}</span>
              );
            })()}
          </a>
        );
      })}
    </div>
  );
}
