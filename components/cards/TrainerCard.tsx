import { Linkedin } from "lucide-react";
import type { Trainer } from "@/lib/types";
import { InitialsAvatar } from "@/components/ui/CourseArt";

export function TrainerCard({ trainer }: { trainer: Trainer }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border shadow-elevated transition hover:-translate-y-0.5 hover:ring-cyan-400 hover:shadow-floating">
      {/* Gradient cover with floating avatar */}
      <div className="relative h-28 bg-gradient-to-br from-navy-900 via-navy-700 to-cyan-500">
        <div className="absolute inset-0 bg-grid-subtle [background-size:20px_20px] opacity-30" aria-hidden />
        <div className="absolute -bottom-8 left-6">
          <InitialsAvatar name={trainer.name} size="lg" accent="gold" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 pt-10">
        <h3 className="text-lg font-heading font-semibold text-navy-900">{trainer.name}</h3>
        <p className="text-sm text-cyan-700">{trainer.title}</p>
        <p className="mt-3 text-sm text-ink-muted line-clamp-4">{trainer.bio}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {trainer.credentials.slice(0, 4).map((c) => (
            <li
              key={c}
              className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-medium text-navy-800 ring-1 ring-inset ring-navy-200"
            >
              {c}
            </li>
          ))}
        </ul>

        {trainer.linkedin ? (
          <a
            href={trainer.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline"
          >
            <Linkedin className="h-4 w-4" /> View profile
          </a>
        ) : null}
      </div>
    </article>
  );
}
