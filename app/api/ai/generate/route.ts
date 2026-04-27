import { NextResponse } from "next/server";
import { z } from "zod";
import { isAuthed } from "@/lib/cms/auth";
import { chat } from "@/lib/ai";

// Admin-only AI content helper. Takes a `purpose` (e.g. "course-headline"),
// an `input` (e.g. the course title), and returns generated text for that
// field.

const Schema = z.object({
  purpose: z.enum([
    "course-headline",
    "course-learning-outcomes",
    "course-assessment",
    "course-certification",
    "course-module-outline",
    "blog-excerpt",
    "testimonial-rewrite",
    "trainer-bio",
    "free-form",
  ]),
  input: z.string().min(1).max(4000),
  context: z.string().max(2000).optional(),
});

const TEMPLATES: Record<string, (input: string, ctx?: string) => string> = {
  "course-headline": (input, ctx) => `You are EIOSH's marketing copywriter. Write a single-line headline (10–16 words, no quote marks) for this course, stressing the outcome for the learner. Course: "${input}". ${ctx ? `Context: ${ctx}` : ""}`,
  "course-learning-outcomes": (input, ctx) => `List 5 concise learning outcomes for the EIOSH course "${input}". ${ctx ? `Context: ${ctx}` : ""} Return one outcome per line, no numbering, no bullet characters, each outcome under 20 words, starting with an action verb.`,
  "course-assessment": (input, ctx) => `Write a single-paragraph assessment description (2–3 sentences) for the EIOSH course "${input}". ${ctx ? `Context: ${ctx}` : ""} Mention the assessment method (written, practical, project) and pass criteria. Plain text, no markdown.`,
  "course-certification": (input, ctx) => `Write a single-paragraph certification description (1–2 sentences) for the EIOSH course "${input}". ${ctx ? `Context: ${ctx}` : ""} Name the awarding body if known, and describe what the certificate enables. Plain text.`,
  "course-module-outline": (input, ctx) => `List 5–7 modules that would make up the EIOSH course "${input}". ${ctx ? `Context: ${ctx}` : ""} Format: "Module title — one-sentence description" per line. Plain text, no numbering, no bullets.`,
  "blog-excerpt": (input) => `Write a compelling 2-sentence blog excerpt (<40 words) based on this title: "${input}". Plain text, no quote marks, no markdown.`,
  "testimonial-rewrite": (input) => `Rewrite this testimonial to be clearer and more professional while keeping the person's voice. Remove HTML, fix grammar, keep it under 80 words, first-person. Original:\n\n${input}`,
  "trainer-bio": (input, ctx) => `Write a 40–60 word professional bio for an EIOSH trainer named "${input}". ${ctx ? `Role/credentials: ${ctx}` : "Make it sector-agnostic within HSE."} Plain text, third person.`,
  "free-form": (input, ctx) => `${input}${ctx ? `\n\nContext: ${ctx}` : ""}`,
};

export async function POST(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const prompt = TEMPLATES[parsed.data.purpose](parsed.data.input, parsed.data.context);
  const text = await chat({
    messages: [
      { role: "system", content: "You are EIOSH's editorial assistant. Respond with the requested content only — no preamble, no follow-up commentary, no markdown unless explicitly asked." },
      { role: "user", content: prompt },
    ],
    maxTokens: 600,
    temperature: 0.5,
  });
  return NextResponse.json({ ok: true, text });
}
