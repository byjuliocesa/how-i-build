import { site } from "@/config/site";
import type { SiteConfig } from "@/config/types";
import { profile } from "@/content/profile";
import type { Locale } from "@/i18n/config";

/** Text in any number of languages; a missing one falls back to English. */
type Localized = Record<string, string | undefined>;

type RemoteProfile = {
  profile?: {
    role?: Localized;
    email?: string;
    links?: { github?: string; linkedin?: string };
  };
};

let request: Promise<RemoteProfile | null> | undefined;

/**
 * Fetched once per build and shared by every page that asks. A slow or broken
 * endpoint must not fail the build, so any error, timeout or unexpected shape
 * reads as "no profile" and the local values stand.
 */
function remote(): Promise<RemoteProfile | null> {
  const url = (site as SiteConfig).profileUrl;
  if (!url) return Promise.resolve(null);

  request ??= fetch(url, { signal: AbortSignal.timeout(5000) })
    .then((response) => (response.ok ? (response.json() as Promise<RemoteProfile>) : null))
    .then((data) => (data && typeof data === "object" ? data : null))
    .catch(() => null);

  return request;
}

function text(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

export async function profileRole(locale: Locale): Promise<string> {
  const role = (await remote())?.profile?.role;
  return text(role?.[locale]) ?? text(role?.en) ?? profile.role[locale];
}

export async function socials(): Promise<SiteConfig["socials"]> {
  const data = (await remote())?.profile;
  return {
    email: text(data?.email) ?? site.socials.email,
    github: text(data?.links?.github) ?? site.socials.github,
    linkedin: text(data?.links?.linkedin) ?? site.socials.linkedin,
  };
}
