import type { RouteLocationRaw, Router } from "vue-router";
import { UUID_RE } from "@/constants/validation";

const segmentPrefix: Record<string, string> = { reports: "RPT" };

export function formatBreadcrumbSegment(seg: string, prevSeg?: string): string {
  if (!UUID_RE.test(seg)) return capitalizeFirstLetter(seg);
  const prefix = prevSeg && segmentPrefix[prevSeg];
  return prefix ? `${prefix}-${seg.slice(0, 8)}` : seg.slice(0, 8);
}

export function formatLabel(str: string) {
  if (!str) return "";
  // replace any _ with space
  const spaced = str.replace(/_/g, " ");
  const words = spaced.split(" ");
  return words.map((word, i) => (i === 0 ? capitalizeFirstLetter(word) : word)).join(" ");
}

/**
 * Maps an enum-like constant object to PrimeVue Select `{ label, value }` options,
 * using `formatLabel` for display. Replaces the repeated
 * `Object.values(X).map((v) => ({ label: formatLabel(v), value: v }))` pattern.
 */
export function enumToSelectOptions<T extends string>(
  enumObj: Record<string, T>,
): { label: string; value: T }[] {
  return Object.values(enumObj).map((value) => ({
    label: formatLabel(value),
    value,
  }));
}

export function capitalizeFirstLetter(str: string) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString("en-US");
};

/** Prefer in-session history; otherwise push a named fallback. */
export function navigateBack(router: Router, fallback: RouteLocationRaw) {
  if (window.history.state?.back) {
    router.back();
    return;
  }
  router.push(fallback);
}

export function timeAgo(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours >= 24) {
    return `${Math.floor(diffHours / 24)}d ago`;
  }
  return `${Math.max(diffHours, 1)}h ago`;
}
