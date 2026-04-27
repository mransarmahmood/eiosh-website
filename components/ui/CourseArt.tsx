import { HardHat, UtensilsCrossed, Flame, Briefcase, Users, Leaf, HeartPulse, GraduationCap, ShieldCheck, Award, BookOpen, Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Deterministic "art" for each course / category — category-coloured gradient
// with a large tinted icon + subtle grid. Keeps the site attractive while real
// imagery from eiosh.com is sourced and dropped into /public/brand.

const ICON_BY_CATEGORY: Record<string, React.ComponentType<{ className?: string }>> = {
  "health-safety-environment": HardHat,
  "food-safety-hospitality": UtensilsCrossed,
  "fire-safety-emergency": Flame,
  "leadership-management": Briefcase,
  "human-resources": Users,
  "environment-sustainability": Leaf,
  "construction-site-safety": HardHat,
  "first-aid-medical": HeartPulse,
  default: GraduationCap,
};

const GRADIENT_BY_CATEGORY: Record<string, string> = {
  "health-safety-environment": "from-navy-900 via-navy-700 to-cyan-600",
  "food-safety-hospitality": "from-amber-600 via-amber-500 to-gold-400",
  "fire-safety-emergency": "from-red-700 via-orange-600 to-amber-500",
  "leadership-management": "from-navy-900 via-navy-700 to-navy-500",
  "human-resources": "from-emerald-800 via-emerald-600 to-teal-500",
  "environment-sustainability": "from-emerald-800 via-emerald-600 to-lime-500",
  "construction-site-safety": "from-gold-500 via-amber-500 to-orange-500",
  "first-aid-medical": "from-rose-700 via-red-600 to-rose-400",
  default: "from-navy-900 via-navy-700 to-cyan-600",
};

interface Props {
  category?: string;
  title?: string;
  imageUrl?: string;
  className?: string;
  badge?: React.ReactNode;
  height?: "sm" | "md" | "lg";
}

export function CourseArt({ category, title, imageUrl, className, badge, height = "md" }: Props) {
  const Icon = ICON_BY_CATEGORY[category ?? "default"] ?? ICON_BY_CATEGORY.default;
  const grad = GRADIENT_BY_CATEGORY[category ?? "default"] ?? GRADIENT_BY_CATEGORY.default;
  const heightCls = height === "sm" ? "h-32" : height === "lg" ? "h-56" : "h-44";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-t-2xl bg-gradient-to-br",
        grad,
        heightCls,
        className
      )}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={title ?? ""} className="absolute inset-0 h-full w-full object-cover opacity-90" />
      ) : null}
      <div className="absolute inset-0 bg-grid-subtle [background-size:20px_20px] opacity-30" aria-hidden />
      <div className="absolute -right-6 -bottom-6 opacity-25" aria-hidden>
        <Icon className="h-40 w-40 text-white" />
      </div>
      <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-white/15 blur-3xl" aria-hidden />
      {badge ? <div className="absolute left-4 top-4 flex flex-wrap gap-1.5">{badge}</div> : null}
      {title ? (
        <div className="absolute bottom-4 left-4 right-4">
          <p className="font-heading text-white text-base font-semibold leading-snug drop-shadow line-clamp-2">{title}</p>
        </div>
      ) : null}
    </div>
  );
}

// Small avatar block — initials on gradient. Used by trainer + testimonial cards.
export function InitialsAvatar({
  name,
  size = "md",
  accent = "navy",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  accent?: "navy" | "cyan" | "gold" | "emerald";
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  const dim = size === "sm" ? "h-10 w-10 text-sm" : size === "lg" ? "h-16 w-16 text-xl" : "h-12 w-12 text-base";
  const grad =
    accent === "cyan"
      ? "from-cyan-700 to-cyan-400"
      : accent === "gold"
      ? "from-gold-500 to-gold-300"
      : accent === "emerald"
      ? "from-emerald-700 to-emerald-400"
      : "from-navy-900 to-cyan-500";
  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-heading font-semibold text-white shadow-elevated ring-2 ring-white",
        grad,
        dim,
        className
      )}
      aria-hidden
    >
      {initials}
    </div>
  );
}

// Decorative pattern tile used in hero imagery stacks.
export function PatternTile({
  label,
  sub,
  tone = "navy",
  className,
  icon: IconProp,
}: {
  label: string;
  sub?: string;
  tone?: "navy" | "cyan" | "gold" | "emerald";
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const IconBase = IconProp ?? ShieldCheck;
  const grad =
    tone === "cyan"
      ? "from-cyan-700 via-cyan-500 to-cyan-300"
      : tone === "gold"
      ? "from-gold-500 via-gold-400 to-amber-300"
      : tone === "emerald"
      ? "from-emerald-700 via-emerald-500 to-emerald-300"
      : "from-navy-900 via-navy-700 to-cyan-600";
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-floating", grad, className)}>
      <div className="absolute inset-0 bg-grid-subtle [background-size:16px_16px] opacity-30" aria-hidden />
      <IconBase className="h-6 w-6 text-white/90" />
      <p className="mt-4 font-heading text-lg font-semibold">{label}</p>
      {sub ? <p className="mt-1 text-sm text-white/80">{sub}</p> : null}
    </div>
  );
}
