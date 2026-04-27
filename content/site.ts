import type { SiteSettings } from "@/lib/types";
import data from "./data/site.json";

// Single source of truth lives in content/data/site.json. Edit via /admin.
export const site = data as SiteSettings;
