import type { CuricartBridgeItem } from "@/lib/content";
import { siteConfig } from "@/lib/config";

const CURICART_HOST = "www.curicart.com";

export function slugifyForUtm(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function normalizeCuricartUrl(canonicalUrl: string) {
  const cleanUrl = canonicalUrl.trim().replace(/\\+$/g, "");
  const url = new URL(cleanUrl);
  if (url.hostname !== CURICART_HOST) {
    throw new Error(`CuriCart URL must use ${CURICART_HOST}`);
  }
  return url;
}

export function withUtm(canonicalUrl: string, utmContent: string) {
  const url = normalizeCuricartUrl(canonicalUrl);
  url.searchParams.set("utm_source", siteConfig.utm.source);
  url.searchParams.set("utm_medium", siteConfig.utm.medium);
  url.searchParams.set("utm_campaign", siteConfig.utm.campaign);
  url.searchParams.set("utm_content", slugifyForUtm(utmContent));
  return url.toString();
}

export function isRenderableBridgeItem(item: CuricartBridgeItem) {
  if (!item.matchReason?.trim()) return false;
  const matchStatus = item.matchStatus || item.status;
  if (matchStatus !== "approved" && matchStatus !== "current") return false;
  const target = normalizeCuricartUrl(item.canonicalUrl);
  return target.hostname === CURICART_HOST;
}
