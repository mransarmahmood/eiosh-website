import { cn } from "@/lib/utils";

// Premium logo tile for awarding bodies. Uses a distinct gradient per brand
// so the set reads as a logo wall rather than a row of identical squares.
const GRADIENTS: Record<string, string> = {
  IOSH: "from-emerald-700 via-emerald-600 to-emerald-400",
  "OSHAcademy USA": "from-blue-800 via-blue-600 to-sky-400",
  OSHAwards: "from-red-700 via-orange-600 to-amber-500",
  "HABC UK": "from-amber-600 via-amber-500 to-gold-400",
  "OTHM UK": "from-indigo-800 via-indigo-600 to-violet-400",
  "NASP USA": "from-rose-700 via-rose-500 to-pink-400",
  "ICBOQ UK": "from-cyan-800 via-cyan-600 to-cyan-400",
  "Global Awards": "from-navy-900 via-navy-700 to-cyan-500",
  "IQ-OHS": "from-teal-800 via-teal-600 to-emerald-400",
  NEBOSH: "from-blue-900 via-navy-800 to-navy-500",
  IEMA: "from-green-800 via-green-600 to-lime-400",
};

export function AwardingBodyLogo({
  shortName,
  size = "md",
  className,
}: {
  shortName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dim = size === "sm" ? "h-10 w-16" : size === "lg" ? "h-16 w-28" : "h-12 w-20";
  const fontSize = size === "sm" ? "text-[0.6rem]" : size === "lg" ? "text-sm" : "text-xs";
  const gradient = GRADIENTS[shortName] ?? "from-navy-900 via-navy-700 to-cyan-500";
  const abbr = shortName.replace(/\s+.*$/, "").slice(0, 6);
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br font-heading font-bold tracking-wider text-white shadow-elevated ring-1 ring-inset ring-white/20",
        gradient,
        dim,
        fontSize,
        className
      )}
      aria-label={shortName}
    >
      {abbr}
    </span>
  );
}
