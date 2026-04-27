"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, RotateCcw } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "eiosh-ai-chat";
const STARTERS = [
  "Which IOSH qualification should I start with?",
  "I manage a kitchen team — do you offer food safety?",
  "How do I verify an EIOSH certificate?",
  "Train 25 supervisors in Dubai — what's the cost?",
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// Renders a lightweight assistant markdown (paragraphs + inline markdown links).
function renderContent(text: string) {
  const paragraphs = text.split(/\n{2,}/);
  return paragraphs.map((p, i) => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(p)) !== null) {
      if (m.index > lastIndex) parts.push(p.slice(lastIndex, m.index));
      parts.push(
        <Link key={`${i}-${m.index}`} href={m[2]} className="font-medium text-cyan-700 underline">
          {m[1]}
        </Link>
      );
      lastIndex = m.index + m[0].length;
    }
    if (lastIndex < p.length) parts.push(p.slice(lastIndex));
    return (
      <p key={i} className={i > 0 ? "mt-2" : ""}>
        {parts}
      </p>
    );
  });
}

export function AIChatFab() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Restore previous chat on first open.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    if (open) scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [open, messages, loading]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const next: Msg[] = [...messages, { id: uid(), role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const body = await res.json().catch(() => ({}));
      const reply = body?.reply ?? "Sorry — I couldn't reach the AI service. Please try again.";
      setMessages((m) => [...m, { id: uid(), role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: uid(), role: "assistant", content: "Network error — please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const reset = () => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI assistant"
        className={cn(
          "fixed z-30 inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold shadow-floating transition",
          // Desktop: bottom-left so it doesn't clash with WhatsApp bottom-right
          "bottom-6 left-6",
          // Mobile: top-right, above sticky CTA
          "md:left-6 md:bottom-6",
          open
            ? "bg-white text-navy-900 ring-1 ring-border"
            : "bg-gradient-to-br from-navy-900 via-navy-700 to-cyan-600 text-white"
        )}
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
        <span className="hidden lg:inline">{open ? "Close" : "Ask EIOSH AI"}</span>
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            className="fixed bottom-24 left-6 z-30 flex h-[540px] w-[calc(100vw-3rem)] max-w-[400px] flex-col overflow-hidden rounded-2xl bg-white shadow-floating ring-1 ring-border"
            role="dialog"
            aria-label="EIOSH AI assistant"
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-700 to-cyan-600 p-5 text-white">
              <div className="absolute inset-0 bg-grid-subtle [background-size:16px_16px] opacity-[0.3]" aria-hidden />
              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ring-1 ring-inset ring-white/20">
                    <Sparkles className="h-3 w-3" /> AI assistant
                  </div>
                  <p className="mt-2 font-heading text-lg font-semibold">How can EIOSH help?</p>
                  <p className="text-xs text-white/75">Ask about qualifications, pricing or admission.</p>
                </div>
                {messages.length > 0 ? (
                  <button
                    type="button"
                    onClick={reset}
                    aria-label="Reset chat"
                    className="rounded-md p-1.5 text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollerRef} className="flex-1 space-y-3 overflow-y-auto bg-surface-subtle px-4 py-4">
              {messages.length === 0 ? (
                <div className="space-y-3">
                  <div className="rounded-2xl bg-white p-3 text-sm text-ink ring-1 ring-border">
                    Hi there 👋 I can answer questions about EIOSH qualifications, awarding bodies, cohort dates and
                    enrolment. Try one of these to start:
                  </div>
                  <ul className="space-y-2">
                    {STARTERS.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onClick={() => send(s)}
                          className="w-full rounded-xl bg-white px-3 py-2 text-left text-sm text-navy-900 ring-1 ring-border transition hover:ring-cyan-400 cursor-pointer"
                        >
                          {s}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex",
                      m.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                        m.role === "user"
                          ? "bg-navy-900 text-white"
                          : "bg-white text-ink ring-1 ring-border"
                      )}
                    >
                      {m.role === "assistant" ? renderContent(m.content) : m.content}
                    </div>
                  </div>
                ))
              )}
              {loading ? (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white px-3.5 py-2.5 text-sm text-ink-muted ring-1 ring-border">
                    <Loader2 className="inline h-4 w-4 animate-spin" /> Thinking…
                  </div>
                </div>
              ) : null}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="border-t border-border bg-white p-3"
            >
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder="Ask about a course, price, or cohort…"
                  rows={1}
                  className="max-h-28 min-h-[40px] flex-1 resize-none rounded-lg border border-border bg-white px-3 py-2 text-sm placeholder:text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-white transition hover:bg-navy-800 disabled:opacity-50 cursor-pointer"
                  aria-label="Send"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-[0.65rem] text-ink-soft">
                Grounded in EIOSH content. For official quotes or admission, visit{" "}
                <Link href="/quotation" className="underline">
                  /quotation
                </Link>{" "}
                or{" "}
                <Link href="/admission" className="underline">
                  /admission
                </Link>
                .
              </p>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
