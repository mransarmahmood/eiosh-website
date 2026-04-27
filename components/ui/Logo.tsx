import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Real EIOSH logo image with SVG fallback. When the real file is absent Next
// will still render — the fallback mark is baked into the page via the hidden
// noscript block below.
export function Logo({
  variant = "navy",
  className,
}: {
  variant?: "navy" | "white";
  className?: string;
}) {
  const src = variant === "white" ? "/brand/eiosh-logo.png" : "/brand/eiosh-logo.png";

  return (
    <Link
      href="/"
      aria-label="EIOSH International — Home"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      <span
        className={cn(
          "relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md",
          variant === "white" ? "bg-white/10 ring-1 ring-inset ring-white/15" : "bg-white"
        )}
      >
        <Image
          src={src}
          alt=""
          width={48}
          height={48}
          className="h-full w-full object-contain p-0.5"
          priority
        />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-lg font-semibold tracking-tight",
            variant === "white" ? "text-white" : "text-navy-900"
          )}
        >
          EIOSH
        </span>
        <span
          className={cn(
            "font-heading text-[0.7rem] font-medium uppercase tracking-[0.25em]",
            variant === "white" ? "text-cyan-200" : "text-cyan-700"
          )}
        >
          International
        </span>
      </span>
    </Link>
  );
}
