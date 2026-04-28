"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";

interface Props {
  threadSlug: string;
}

export function CommentForm({ threadSlug }: Props) {
  const [body, setBody] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/forum/threads/${threadSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, authorName: name }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrorMsg(
          res.status === 401
            ? "Please sign in to your student dashboard before replying."
            : json.error ?? "Could not post. Try again.",
        );
        setState("error");
        return;
      }
      setBody("");
      router.refresh();
      setState("idle");
    } catch {
      setErrorMsg("Network error.");
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-3 space-y-3 rounded-2xl border border-border bg-white p-4">
      <input
        type="text"
        placeholder="Your name (as it'll appear)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
      />
      <textarea
        rows={4}
        placeholder="Write a thoughtful reply…"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
        minLength={2}
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
      />
      {errorMsg && (
        <p className="text-xs text-red-700" role="alert">
          {errorMsg}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "loading" || !body || !name}
        className="inline-flex h-10 items-center gap-2 rounded-lg bg-navy-900 px-4 text-sm font-semibold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        Post reply
      </button>
    </form>
  );
}
