import type { ComponentType } from "react";
import type { ByLocale } from "@/i18n/config";
import PrivacyEn from "./privacy.en.mdx";
import PrivacyPt from "./privacy.pt.mdx";
import PrivacyEs from "./privacy.es.mdx";

/** Same guarantee as the cases: a missing locale is a type error. */
export const privacy: ByLocale<ComponentType> = {
  en: PrivacyEn,
  pt: PrivacyPt,
  es: PrivacyEs,
};
