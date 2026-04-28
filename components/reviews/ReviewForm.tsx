"use client";

import { useState } from "react";
import { Star, Loader2, Check, AlertCircle } from "lucide-react";

interface Props {
  enrolmentId: string;
  courseTitle: string;
  defaultName?: string;
}

export function ReviewForm({ enrolmentId, courseTitle, defaultName = "" }: Props) {
  const [rating, setRating] = useState<0 | 1 | 2 | 3 | 4 | 5>(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState(defaultName);
  const [company, setCompany] = useState("");
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rating) {
      setErrorMsg("Please pick a rating.");
      setState("error");
      return;
    }
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrolmentId,
          rating,
          reviewerName: name,
          reviewerCompany: company || undefined,
          body,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrorMsg(json.error ?? "Could not submit. Try again.");
        setState("error");
        return;
      }
      setState("done");
    } catch {
      setErrorMsg("Network error. Please retry.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <Check className="mx-auto h-10 w-10 text-green-600" />
        <p className="mt-2 font-semibold text-green-900">Thank you!</p>
        <p className="mt-1 text-sm text-green-800">
          Your review will appear on the {courseTitle} page after a quick moderation pass.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-border bg-white p-6">
      <div>
        <p className="text-sm font-medium text-navy-900">Your rating</p>
        <div
          className="mt-1 flex gap-1"
          onMouseLeave={() => setHover(0)}
          role="radiogroup"
          aria-label="Star rating"
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const filled = (hover || rating) >= n;
            return (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                onMouseEnter={() => setHover(n)}
                onClick={() => setRating(n as 1 | 2 | 3 | 4 | 5)}
                className="rounded p-0.5 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <Star
                  className={`h-7 w-7 ${
                    filled ? "fill-yellow-400 text-yellow-500" : "text-gray-300"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-navy-900">Your name (as it'll appear)</span>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
          placeholder="Jane Smith"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-navy-900">Company / role (optional)</span>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
          placeholder="HSE Manager, Acme Engineering"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-navy-900">Your review</span>
        <textarea
          required
          minLength={20}
          maxLength={2000}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={5}
          className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
          placeholder="What did you find most useful? How has it changed your work?"
        />
        <span className="mt-1 block text-xs text-ink-soft">{body.length} / 2000 characters</span>
      </label>

      {errorMsg && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
          <AlertCircle className="mt-0.5 h-4 w-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-navy-900 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:cursor-wait disabled:opacity-70"
      >
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        Submit review
      </button>
    </form>
  );
}
