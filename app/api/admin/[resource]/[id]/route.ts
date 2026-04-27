import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/cms/auth";
import { getSchema } from "@/lib/cms/schemas";
import { buildRecord } from "@/lib/cms/shape";
import { deleteOne, readOne, updateOne } from "@/lib/cms/store";

function gate() {
  if (!isAuthed()) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  return null;
}

interface Ctx {
  params: { resource: string; id: string };
}

export async function GET(_req: Request, { params }: Ctx) {
  const g = gate();
  if (g) return g;
  try {
    const record = await readOne(params.resource, params.id);
    if (!record) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true, record });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  const g = gate();
  if (g) return g;
  const schema = getSchema(params.resource);
  if (!schema) return NextResponse.json({ error: "unknown_resource" }, { status: 404 });
  const input = await req.json().catch(() => ({}));
  const record = buildRecord(schema.fields, input);
  try {
    const saved = await updateOne(schema.key, params.id, record);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, record: saved });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const g = gate();
  if (g) return g;
  try {
    await deleteOne(params.resource, params.id);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
