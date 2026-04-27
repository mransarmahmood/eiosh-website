"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check, X } from "lucide-react";

interface Props {
  purpose:
    | "course-headline"
    | "course-learning-outcomes"
    | "course-assessment"
    | "course-certification"
    | "course-module-outline"
    | "blog-excerpt"
    | "testimonial-rewrite"
    | "trainer-bio"
    | "free-form";
  /** Short label for the input that drives generation (e.g. the course title). */
  inputLabel?: string;
  /** Current input value to use when user hasn't typed anything. */
  getInput: () => string;
  /** Optional extra context sent to the model. */
  getContext?: () => string | undefined;
  /** Called with the raw model text; caller decides how to apply it. */
  onInsert: (text: string) => void;
  /** Button label. */
  label?: string;
}

// A schema-aware AI "generate" button. When clicked it calls /api/ai/generate
// with the current context, shows a preview, and lets the admin Insert/Cancel.
export function AIGenerateButton({
  purpose,
  inputLabel = "title",
  getInput,
  getContext,
  onInsert,
  label = "Generate with AI",
}: Props) {
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "preview"; text: string }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  async function run() {
    const input = getInput().trim();
    if (!input) {
      setState({ kind: "error", message: `Please fill in the ${inputLabel} first.` });
      return;
    }
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ purpose, input, context: getContext?.() }),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) {
        setState({ kind: "error", message: body.error ?? "Generation failed." });
        return;
      }
      setState({ kind: "preview", text: String(body.text ?? "").trim() });
    } catch {
      setState({ kind: "error", message: "Network error." });
    }
  }

  function accept() {
    if (state.kind !== "preview") return;
    onInsert(state.text);
    setState({ kind: "idle" });
  }

  return (
    <div className="mt-2">
      {state.kind === "idle" || state.kind === "error" ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={run}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-br from-navy-900 via-navy-700 to-cyan-600 px-2.5 py-1.5 text-[0.7rem] font-semibold text-white shadow-elevated transition hover:from-navy-800 hover:to-cyan-500 cursor-pointer"
          >
            <Sparkles className="h-3 w-3" /> {label}
          </button>
          {state.kind === "error" ? (
            <span className="text-[0.7rem] text-red-600">{state.message}</span>
          ) : null}
        </div>
      ) : null}
      {state.kind === "loading" ? (
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-50 px-2.5 py-1.5 text-[0.7rem] font-medium text-cyan-800 ring-1 ring-inset ring-cyan-200">
          <Loader2 className="h-3 w-3 animate-spin" /> Generating…
        </div>
      ) : null}
      {state.kind === "preview" ? (
        <div className="mt-2 rounded-lg bg-gradient-to-br from-cyan-50/60 to-white p-3 ring-1 ring-cyan-200">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-700">AI suggestion</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink">{state.text}</p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={accept}
              className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-navy-800 cursor-pointer"
            >
              <Check className="h-3 w-3" /> Insert
            </button>
            <button
              type="button"
              onClick={run}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-navy-900 ring-1 ring-inset ring-border hover:ring-cyan-400 cursor-pointer"
            >
              <Sparkles className="h-3 w-3" /> Regenerate
            </button>
            <button
              type="button"
              onClick={() => setState({ kind: "idle" })}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-ink-muted hover:text-navy-900 cursor-pointer"
            >
              <X className="h-3 w-3" /> Dismiss
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
