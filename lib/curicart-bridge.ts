import type { CuricartBridgeItem } from "@/lib/content";
import { siteConfig } from "@/lib/config";

const CURICART_HOST = "www.curicart.com";

export function withUtm(canonicalUrl: string, contentSlug: string) {
  const url = new URL(canonicalUrl);
  url.searchParams.set("utm_source", siteConfig.utm.source);
  url.searchParams.set("utm_medium", siteConfig.utm.medium);
  url.searchParams.set("utm_campaign", siteConfig.utm.campaign);
  url.searchParams.set("utm_content", contentSlug);
  return url.toString();
}

export function isRenderableBridgeItem(item: CuricartBridgeItem) {
  if (!item.matchReason?.trim()) return false;
  const matchStatus = item.matchStatus || item.status;
  if (matchStatus !== "approved" && matchStatus !== "current") return false;
  const target = new URL(item.utmUrl);
  return target.hostname === CURICART_HOST && target.searchParams.get("utm_source") === siteConfig.utm.source;
}
