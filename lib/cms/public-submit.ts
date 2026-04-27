import "server-only";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createOne } from "./store";

// Shared helper: accept a public submission, validate with the provided Zod
// schema, stamp defaults, and persist through the same store the CMS uses so
// the new record appears in /admin immediately.

export async function handlePublicSubmit<T extends z.ZodTypeAny>(
  req: Request,
  resourceKey: string,
  schema: T,
  transform: (parsed: z.infer<T>) => Record<string, unknown>
) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  try {
    const record = {
      ...transform(parsed.data),
      receivedAt: new Date().toISOString(),
      status: "new",
    };
    await createOne(resourceKey, record);
    revalidatePath(`/admin/${resourceKey}`);
    return Response.json({ ok: true });
  } catch (err) {
    console.error(`[submit:${resourceKey}]`, err);
    return Response.json({ ok: false, error: "persist_failed" }, { status: 500 });
  }
}
