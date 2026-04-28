import "server-only";
import { getSettingSync } from "@/lib/runtime-config";

// ------------------------------------------------------------------
// Pluggable AI client. One module, any OpenAI-compatible provider.
//
// Providers supported out of the box (all offer a usable free tier):
//
//   groq         — FREE generous tier, Llama 3 / Mixtral (very fast)
//   openrouter   — FREE models available (tag :free), wide catalog
//   huggingface  — FREE inference API, any chat-template model
//   openai       — standard, requires paid key
//   ollama       — local, no key needed (http://localhost:11434)
//   mock         — deterministic fake response for offline demo
//
// Configure via .env.local:
//   AI_PROVIDER=groq
//   AI_API_KEY=gsk_...
//   AI_MODEL=llama-3.1-8b-instant            (optional override)
//   AI_BASE_URL=https://api.groq.com/openai/v1  (optional override)
// ------------------------------------------------------------------

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export interface ChatOptions {
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
}

interface ProviderConfig {
  baseUrl: string;
  model: string;
  apiKey?: string;
  authHeader?: string;
}

function readProvider(): ProviderConfig & { name: string } {
  // Read /admin/settings overrides if available, otherwise fall back to env.
  // `getSettingSync` is safe to call before the runtime-config file is loaded;
  // it just returns the env value in that case.
  const name = (getSettingSync("AI_PROVIDER", "mock") || "mock").toLowerCase();
  const apiKey = getSettingSync("AI_API_KEY") || undefined;
  const modelOverride = getSettingSync("AI_MODEL") || undefined;
  const baseOverride = getSettingSync("AI_BASE_URL") || undefined;

  switch (name) {
    case "groq":
      return {
        name,
        baseUrl: baseOverride ?? "https://api.groq.com/openai/v1",
        model: modelOverride ?? "llama-3.1-8b-instant",
        apiKey,
      };
    case "openrouter":
      return {
        name,
        baseUrl: baseOverride ?? "https://openrouter.ai/api/v1",
        model: modelOverride ?? "meta-llama/llama-3.1-8b-instruct:free",
        apiKey,
      };
    case "huggingface":
      return {
        name,
        baseUrl:
          baseOverride ?? "https://api-inference.huggingface.co/v1",
        model: modelOverride ?? "meta-llama/Meta-Llama-3-8B-Instruct",
        apiKey,
      };
    case "openai":
      return {
        name,
        baseUrl: baseOverride ?? "https://api.openai.com/v1",
        model: modelOverride ?? "gpt-4o-mini",
        apiKey,
      };
    case "ollama":
      return {
        name,
        baseUrl: baseOverride ?? "http://localhost:11434/v1",
        model: modelOverride ?? "llama3.1",
        apiKey: "ollama", // Ollama ignores the key but the header has to exist
      };
    default:
      return { name: "mock", baseUrl: "", model: "mock" };
  }
}

export function aiEnabled(): boolean {
  const cfg = readProvider();
  if (cfg.name === "mock") return false;
  if (cfg.name === "ollama") return true;
  return !!cfg.apiKey;
}

export function providerName(): string {
  return readProvider().name;
}

/**
 * Generic chat completion. Returns the assistant text. Never throws for
 * network errors — returns a short, graceful fallback message instead.
 */
export async function chat({ messages, maxTokens = 600, temperature = 0.4 }: ChatOptions): Promise<string> {
  const cfg = readProvider();
  if (cfg.name === "mock" || (!cfg.apiKey && cfg.name !== "ollama")) {
    return mockReply(messages);
  }
  try {
    const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[ai:${cfg.name}] ${res.status} ${text.slice(0, 200)}`);
      return "I'm having trouble reaching our AI service right now — please try again in a moment, or email info@eiosh.com.";
    }
    const body = await res.json();
    const content = body?.choices?.[0]?.message?.content?.trim();
    return content || "I couldn't generate a response for that. Could you rephrase?";
  } catch (err) {
    console.error(`[ai:${cfg.name}] network error`, err);
    return "The AI service is unavailable right now. Please try again shortly.";
  }
}

// Offline/demo fallback — deterministic, site-aware for a handful of common
// questions. Keeps /api/ai/chat useful when no API key is configured.
function mockReply(messages: ChatMessage[]): string {
  const last = messages.filter((m) => m.role === "user").pop()?.content?.toLowerCase() ?? "";
  if (!last) return "Hi — how can I help you navigate EIOSH qualifications today?";
  if (last.match(/\b(iosh|managing safely)\b/)) {
    return "IOSH Managing Safely is our benchmark 3-day qualification for line managers and supervisors. We deliver it online, in-person and blended. Starting price: US$385. Browse it under Courses, or apply via /admission.";
  }
  if (last.match(/\b(nebosh|igc)\b/)) {
    return "The NEBOSH International General Certificate is a 12-week blended programme with a 96% pass rate. Starting price: US$995. Multiple cohorts per year — latest start date is on the Calendar page.";
  }
  if (last.match(/\b(food|haccp|habc)\b/)) {
    return "We deliver HABC Level 2 Food Safety in Catering, with Ofqual-regulated certification. Bilingual (EN/AR). Ideal for kitchen teams and hospitality supervisors.";
  }
  if (last.match(/\b(contact|phone|email|address)\b/)) {
    return "You can reach EIOSH at info@eiosh.com or +92 300 458 0231. Office: Royal Arcade, Lahore, Pakistan. Visit the Contact page for regional offices (Dubai, Riyadh, Karachi, London).";
  }
  if (last.match(/\b(certificate|verify|authenticate)\b/)) {
    return "Every EIOSH certificate has a unique reference and QR code. Visit /verify-certificate to authenticate any certificate in seconds — our registry holds 681+ records.";
  }
  if (last.match(/\b(price|cost|fee|quote)\b/)) {
    return "Pricing varies by qualification and cohort size. Individual prices start at US$95 (IOSH Working Safely). For team / corporate training, request a quotation at /quotation.";
  }
  if (last.match(/\b(apply|admission|enrol|register)\b/)) {
    return "You can apply for any qualification at /admission — our admissions team confirms eligibility within one business day. For corporate cohorts, use /quotation instead.";
  }
  return (
    "I'm a demo assistant right now — set AI_PROVIDER and AI_API_KEY in .env.local to enable full AI answers. " +
    "In the meantime, explore our qualifications catalogue at /courses, or email info@eiosh.com for personalised help."
  );
}
