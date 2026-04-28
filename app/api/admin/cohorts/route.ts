import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/cms/auth";
import {
  listCohorts,
  upsertCohort,
  deleteCohort,
  nextReference,
  type Cohort,
} from "@/lib/cohorts";

function deny() {
  return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
}

export async function GET() {
  if (!isAuthed()) return deny();
  return NextResponse.json({ ok: true, cohorts: await listCohorts() });
}

export async function POST(req: Request) {
  if (!isAuthed()) return deny();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const c = body as Partial<Cohort> & { id?: string };
  if (!c.courseSlug || !c.startDate) {
    return NextResponse.json({ ok: false, error: "courseSlug + startDate required" }, { status: 400 });
  }
  const all = await listCohorts();
  const existing = c.id ? all.find((x) => x.id === c.id) : null;
  const next: Cohort = {
    id: existing?.id ?? c.id ?? "ch-" + Math.random().toString(36).slice(2, 10),
    reference: existing?.reference ?? nextReference(all),
    courseSlug: String(c.courseSlug),
    trainerSlug: c.trainerSlug ? String(c.trainerSlug) : undefined,
    startDate: String(c.startDate),
    endDate: c.endDate ? String(c.endDate) : undefined,
    schedule: c.schedule ? String(c.schedule) : undefined,
    mode: (["in-person", "online", "hybrid", "blended"].includes(String(c.mode))
      ? c.mode
      : "in-person") as Cohort["mode"],
    location: c.location ? String(c.location) : undefined,
    capacity: Math.max(0, Number(c.capacity ?? 20)),
    bookedCount: Math.max(0, Number(c.bookedCount ?? 0)),
    status: (["open", "confirmed", "running", "closed", "cancelled"].includes(String(c.status))
      ? c.status
      : "open") as Cohort["status"],
    notes: c.notes ? String(c.notes) : undefined,
    waitlist: Array.isArray(c.waitlist) ? c.waitlist.map(String) : existing?.waitlist ?? [],
  };
  await upsertCohort(next);
  return NextResponse.json({ ok: true, cohort: next });
}

export async function DELETE(req: Request) {
  if (!isAuthed()) return deny();
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  await deleteCohort(id);
  return NextResponse.json({ ok: true });
}
