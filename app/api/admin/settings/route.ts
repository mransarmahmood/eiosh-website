import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/cms/auth";
import { readAllSettings, writeSettings, SETTINGS_KEYS, type SettingKey } from "@/lib/runtime-config";

export async function GET() {
  if (!isAuthed()) return NextResponse.json({ ok: false }, { status: 401 });
  const settings = await readAllSettings();
  // Mask sensitive values when returning to the client.
  return NextResponse.json({
    ok: true,
    settings: settings.map((s) => ({
      key: s.key,
      isSet: s.isSet,
      isSensitive: s.isSensitive,
      value: s.isSensitive && s.value ? "•".repeat(8) : s.value,
    })),
  });
}

export async function POST(req: Request) {
  if (!isAuthed()) return NextResponse.json({ ok: false }, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
  const valid: Partial<Record<SettingKey, string>> = {};
  for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
    if (!SETTINGS_KEYS.includes(k as SettingKey)) continue;
    valid[k as SettingKey] = typeof v === "string" ? v : "";
  }
  await writeSettings(valid);
  return NextResponse.json({ ok: true });
}
