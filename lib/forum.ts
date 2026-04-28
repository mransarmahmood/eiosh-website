import { promises as fs } from "node:fs";
import { join } from "node:path";

export interface ForumComment {
  id: string;
  authorEmail: string;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface ForumThread {
  id: string;
  slug: string;
  title: string;
  category: string;
  authorEmail: string;
  authorName: string;
  body: string;
  createdAt: string;
  pinned: boolean;
  locked: boolean;
  comments: ForumComment[];
}

const FILE = join(process.cwd(), "content", "data", "forum-threads.json");

export async function listThreads(): Promise<ForumThread[]> {
  try {
    const txt = await fs.readFile(FILE, "utf-8");
    const arr = JSON.parse(txt);
    if (!Array.isArray(arr)) return [];
    return (arr as ForumThread[]).sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      // Newest activity first (last comment, fallback to thread date).
      const aTs = a.comments.at(-1)?.createdAt ?? a.createdAt;
      const bTs = b.comments.at(-1)?.createdAt ?? b.createdAt;
      return Date.parse(bTs) - Date.parse(aTs);
    });
  } catch {
    return [];
  }
}

export async function findThread(slug: string): Promise<ForumThread | null> {
  return (await listThreads()).find((t) => t.slug === slug || t.id === slug) ?? null;
}

export async function saveThreads(rows: ForumThread[]): Promise<void> {
  await fs.mkdir(join(process.cwd(), "content", "data"), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf-8");
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export async function addThread(input: {
  title: string;
  body: string;
  category?: string;
  authorEmail: string;
  authorName: string;
}): Promise<ForumThread> {
  const all = await listThreads();
  const baseSlug = slugify(input.title);
  let slug = baseSlug;
  let n = 1;
  while (all.some((t) => t.slug === slug)) {
    n += 1;
    slug = `${baseSlug}-${n}`;
  }
  const thread: ForumThread = {
    id: "th-" + Math.random().toString(36).slice(2, 10),
    slug,
    title: input.title.trim(),
    category: input.category?.trim() || "General",
    authorEmail: input.authorEmail.toLowerCase(),
    authorName: input.authorName.trim(),
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
    pinned: false,
    locked: false,
    comments: [],
  };
  all.push(thread);
  await saveThreads(all);
  return thread;
}

export async function addComment(
  threadSlug: string,
  input: { authorEmail: string; authorName: string; body: string },
): Promise<{ ok: boolean; thread?: ForumThread; error?: string }> {
  const all = await listThreads();
  const i = all.findIndex((t) => t.slug === threadSlug || t.id === threadSlug);
  if (i < 0) return { ok: false, error: "Thread not found." };
  if (all[i].locked) return { ok: false, error: "Thread is locked." };
  all[i].comments.push({
    id: "cm-" + Math.random().toString(36).slice(2, 10),
    authorEmail: input.authorEmail.toLowerCase(),
    authorName: input.authorName.trim(),
    body: input.body.trim(),
    createdAt: new Date().toISOString(),
  });
  await saveThreads(all);
  return { ok: true, thread: all[i] };
}
