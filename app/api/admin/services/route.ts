import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/cms/auth";
import {
  listServices,
  upsertService,
  deleteService,
  type Service,
} from "@/lib/services";

function requireAuth() {
  if (!isAuthed()) {
    return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const blocked = requireAuth();
  if (blocked) return blocked;
  const services = await listServices();
  return NextResponse.json({ ok: true, services });
}

export async function POST(req: Request) {
  const blocked = requireAuth();
  if (blocked) return blocked;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }
  const s = body as Service;
  if (!s.id || !s.title) {
    return NextResponse.json({ ok: false, error: "id and title are required" }, { status: 400 });
  }
  const next: Service = {
    id: String(s.id),
    slug: String(s.slug ?? s.id),
    title: String(s.title),
    category: s.category ? String(s.category) : undefined,
    summary: s.summary ? String(s.summary) : undefined,
    deliverables: Array.isArray(s.deliverables)
      ? s.deliverables.map((d) => String(d)).filter(Boolean)
      : [],
    defaultPrice: Number(s.defaultPrice ?? 0),
    currency: String(s.currency ?? "USD"),
    unit: s.unit ? String(s.unit) : undefined,
  };
  await upsertService(next);
  return NextResponse.json({ ok: true, service: next });
}

export async function DELETE(req: Request) {
  const blocked = requireAuth();
  if (blocked) return blocked;
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "id query param required" }, { status: 400 });
  }
  await deleteService(id);
  return NextResponse.json({ ok: true });
}
