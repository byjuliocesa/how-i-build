import type { ComponentType } from "react";
import type { ByLocale } from "@/i18n/config";
import AboutEn from "./about.en.mdx";
import AboutPt from "./about.pt.mdx";
import AboutEs from "./about.es.mdx";

export const about: ByLocale<ComponentType> = {
  en: AboutEn,
  pt: AboutPt,
  es: AboutEs,
};
