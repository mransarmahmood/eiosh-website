import type { Certification } from "@/lib/types";
import data from "./data/certifications.json";

export const certifications = data as Certification[];

export function activeCertifications(): Certification[] {
  return certifications.filter((c) => c.active);
}

export function popularCertifications(): Certification[] {
  return certifications.filter((c) => c.active && c.popular);
}

export function findCertification(slug: string): Certification | undefined {
  return certifications.find((c) => c.slug === slug);
}
