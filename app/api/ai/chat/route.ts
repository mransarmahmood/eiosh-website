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
  // Compact course catalogue — title, slug, level, duration, price, awarding body.
  const courseList = courses
    .slice(0, 30)
    .map((c) => {
      const price = c.priceFromUSD ? `from US$${c.priceFromUSD}` : "price on request";
      const body = c.awardingBody ? ` · ${c.awardingBody}` : "";
      const dur = c.durationHours ? ` · ${c.durationHours}h` : "";
      return `- ${c.title} (/courses/${c.slug}) — ${c.level}${dur}${body} · ${price} — ${c.headline?.slice(0, 100) ?? ""}`;
    })
    .join("\n");
  const awardingBodies = accreditations.map((a) => `${a.shortName} (${a.name})`).join(", ");
  const categoryList = categories.map((c) => c.title).join(", ");
  const faqLines = faqs.slice(0, 12).map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

  return `You are the EIOSH assistant — a concise, factual guide to EIOSH International's qualifications and services.

About EIOSH:
- Name: ${site.brand.name}
- Tagline: ${site.brand.tagline}
- Approved centre for: ${awardingBodies}
- Categories: ${categoryList}
- Contact: ${site.contact.email} · ${site.contact.phone} · ${site.contact.addressLines.join(", ")}

Programmes (with current pricing):
${courseList}

Common answers:
${faqLines}

Rules:
- Keep answers under 120 words unless the user asks for more.
- When recommending a qualification, link it as a markdown link like [Title](/courses/slug).
- Quote prices in USD as shown above. If a price isn't listed, say "price on request" and link to /quotation.
- If the user asks to apply or enrol, direct them to /admission, /quotation, or the course's "Enrol now" button.
- For LMS / exams / invoices, point to /student (the unified dashboard).
- For certificate verification, point to /verify-certificate.
- If you genuinely don't know, say so and point them to ${site.contact.email}.
- Never invent course details, cohort dates, accreditations, or pricing not in the data above.`;
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
