import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { isAuthed } from "@/lib/cms/auth";
import { getSchema } from "@/lib/cms/schemas";
import { buildRecord } from "@/lib/cms/shape";
import { createOne, listAll, updateOne } from "@/lib/cms/store";

function requireAuth() {
  if (!isAuthed()) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  return null;
}

interface Ctx {
  params: { resource: string };
}

export async function GET(_req: Request, { params }: Ctx) {
  const gate = requireAuth();
  if (gate) return gate;
  try {
    const { records } = await listAll(params.resource);
    return NextResponse.json({ ok: true, records });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 404 });
  }
}

// Collection create, or singleton update (same endpoint)
export async function POST(req: Request, { params }: Ctx) {
  const gate = requireAuth();
  if (gate) return gate;
  const schema = getSchema(params.resource);
  if (!schema) return NextResponse.json({ error: "unknown_resource" }, { status: 404 });
  const input = await req.json().catch(() => ({}));
  const record = buildRecord(schema.fields, input);
  try {
    if (schema.shape === "singleton") {
      await updateOne(schema.key, "_", record);
    } else {
      await createOne(schema.key, record);
    }
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true, record });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
