import Link from "next/link";
import { User } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { authorTrainer } from "@/lib/blog";

interface Props {
  post: BlogPost;
  /** Show extended bio rather than just name + role. */
  expanded?: boolean;
}

/**
 * Renders the post's author. If `authorTrainerSlug` matches a trainer in the CMS
 * we link through to /trainers#slug and pull their photo + role; otherwise we fall
 * back to the plain `author` string.
 */
export function AuthorByline({ post, expanded = false }: Props) {
  const trainer = authorTrainer(post);

  if (!trainer) {
    return (
      <p className="flex items-center gap-2 text-sm uppercase tracking-wider text-cyan-700">
        <User className="h-3.5 w-3.5" /> By {post.author}
      </p>
    );
  }

  return (
    <Link
      href={`/trainers#${trainer.slug}`}
      className="group flex items-start gap-3 rounded-lg border border-border bg-white/70 p-3 transition hover:border-cyan-300 hover:bg-white"
    >
      {trainer.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={trainer.image}
          alt=""
          className="h-12 w-12 flex-shrink-0 rounded-full object-cover ring-2 ring-white"
        />
      ) : (
        <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-navy-100 text-navy-700">
          <User className="h-5 w-5" />
        </span>
      )}
      <span className="min-w-0">
        <span className="block text-[0.7rem] uppercase tracking-wider text-ink-soft">By</span>
        <span className="block font-semibold text-navy-900 group-hover:text-cyan-700">
          {trainer.name}
        </span>
        {trainer.title && (
          <span className="block text-xs text-ink-soft">{trainer.title}</span>
        )}
        {expanded && trainer.bio && (
          <span className="mt-2 block text-sm text-ink-soft">{trainer.bio}</span>
        )}
      </span>
    </Link>
  );
}
