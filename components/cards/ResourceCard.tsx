import { BookText, StickyNote, FileCheck, FileDown, ListChecks, FileSpreadsheet, Download, Lock, Mail } from "lucide-react";
import type { ResourceItem } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const KIND_ICON = {
  book: BookText,
  notes: StickyNote,
  "sample-paper": FileCheck,
  brochure: FileDown,
  checklist: ListChecks,
  whitepaper: FileSpreadsheet,
} as const;

const KIND_LABEL: Record<ResourceItem["kind"], string> = {
  book: "Book",
  notes: "Study notes",
  "sample-paper": "Sample paper",
  brochure: "Brochure",
  checklist: "Checklist",
  whitepaper: "Whitepaper",
};

const KIND_TONE: Record<ResourceItem["kind"], string> = {
  book: "from-navy-900 to-navy-700",
  notes: "from-cyan-700 to-cyan-500",
  "sample-paper": "from-gold-500 to-gold-400",
  brochure: "from-navy-800 to-cyan-600",
  checklist: "from-emerald-700 to-emerald-500",
  whitepaper: "from-navy-700 to-cyan-700",
};

export function ResourceCard({ r }: { r: ResourceItem }) {
  const Icon = KIND_ICON[r.kind];
  const gated = r.accessLevel !== "public";
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border shadow-elevated transition hover:-translate-y-0.5 hover:ring-cyan-400 hover:shadow-floating">
      {/* Cover */}
      <div className={`relative h-44 bg-gradient-to-br ${KIND_TONE[r.kind]}`}>
        <div className="absolute inset-0 bg-grid-subtle [background-size:20px_20px] opacity-30" aria-hidden />
        <div className="absolute inset-0 flex flex-col justify-between p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium backdrop-blur">
              <Icon className="h-3.5 w-3.5" /> {KIND_LABEL[r.kind]}
            </span>
            <span className="text-xs text-white/80">
              {r.language === "en-ar" ? "EN · AR" : r.language.toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-heading text-lg font-semibold leading-snug text-balance line-clamp-3">{r.title}</p>
            <p className="mt-1 text-xs text-white/75">
              {r.pages ? `${r.pages} pages · ` : ""}
              {r.sizeMB ? `${r.sizeMB} MB` : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm text-ink-muted line-clamp-3">{r.summary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          <Badge tone="neutral">Updated {formatDate(r.updatedAt)}</Badge>
          {r.accessLevel === "email-gated" ? (
            <Badge tone="cyan">
              <Mail className="h-3 w-3" /> Email to access
            </Badge>
          ) : null}
          {r.accessLevel === "learner-only" ? (
            <Badge tone="gold">
              <Lock className="h-3 w-3" /> Learner-only
            </Badge>
          ) : null}
          {r.accessLevel === "public" ? <Badge tone="success">Public download</Badge> : null}
        </div>
        <div className="mt-auto pt-6">
          <a
            href={r.fileUrl ?? "/contact"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy-800 cursor-pointer"
          >
            {gated ? (
              <>
                <Mail className="h-4 w-4" /> Request access
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> Download PDF
              </>
            )}
          </a>
        </div>
      </div>
    </article>
  );
}
