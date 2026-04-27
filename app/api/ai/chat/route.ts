import { NextResponse } from "next/server";
import { z } from "zod";
import { chat, aiEnabled, providerName } from "@/lib/ai";
import { courses } from "@/content/courses";
import { categories } from "@/content/categories";
import { accreditations } from "@/content/accreditations";
import { faqs } from "@/content/faqs";
import { site } from "@/content/site";

// Public AI chat endpoint. Loads a compact site context into the system prompt
// so the assistant can answer course / qualification questions grounded in
// real content.

const Schema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(4000) }))
    .min(1)
    .max(20),
});

function buildSystemPrompt() {
  const courseList = courses
    .slice(0, 25)
    .map((c) => `- ${c.title} (${c.slug}) — ${c.headline?.slice(0, 120) ?? ""}`)
    .join("\n");
  const awardingBodies = accreditations.map((a) => `${a.shortName} (${a.name})`).join(", ");
  const categoryList = categories.map((c) => c.title).join(", ");
  const faqLines = faqs.slice(0, 8).map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

  return `You are the EIOSH assistant — a concise, factual guide to EIOSH International's qualifications and services.

About EIOSH:
- Name: ${site.brand.name}
- Tagline: ${site.brand.tagline}
- Approved centre for: ${awardingBodies}
- Categories: ${categoryList}
- Contact: ${site.contact.email} · ${site.contact.phone} · ${site.contact.addressLines.join(", ")}

Top programmes:
${courseList}

Common answers:
${faqLines}

Rules:
- Keep answers under 120 words unless the user asks for more.
- When recommending a qualification, include the course slug as a markdown link like [Title](/courses/slug).
- If the user asks to apply or enrol, direct them to /admission or /quotation.
- If you genuinely don't know, say so and point them to info@eiosh.com.
- Never make up course prices, cohort dates, or accreditations. If uncertain, suggest the user checks the relevant page.`;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const reply = await chat({
    messages: [{ role: "system", content: buildSystemPrompt() }, ...parsed.data.messages],
    maxTokens: 400,
    temperature: 0.3,
  });
  return NextResponse.json({
    ok: true,
    reply,
    provider: providerName(),
    enabled: aiEnabled(),
  });
}
