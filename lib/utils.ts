import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string, locale = "en-GB") {
  return new Date(iso).toLocaleDateString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatDuration(hours: number) {
  if (hours < 40) return `${hours} hours`;
  const weeks = Math.round(hours / 40);
  return `${weeks} week${weeks === 1 ? "" : "s"}`;
}
