import { NextResponse } from "next/server";
import { z } from "zod";
import { hasPermission } from "@/lib/cms/auth";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
} from "@/lib/cms/users";
import { listRoles } from "@/lib/cms/rbac";

async function deny() {
  if (!(await hasPermission("users:manage"))) {
    return NextResponse.json(
      { ok: false, error: "You don't have permission to manage users." },
      { status: 403 },
    );
  }
  return null;
}

const RoleEnum = z.enum(listRoles() as [string, ...string[]]);

const CreateBody = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(2).max(120),
  password: z.string().min(8).max(120),
  role: RoleEnum,
  modules: z.array(z.string()).optional(),
  permissionOverrides: z.array(z.string()).optional(),
  active: z.boolean().optional(),
});

const UpdateBody = z.object({
  id: z.string().min(2),
  name: z.string().trim().min(2).max(120).optional(),
  role: RoleEnum.optional(),
  modules: z.array(z.string()).optional(),
  permissionOverrides: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  newPassword: z.string().min(8).max(120).optional(),
});

export async function GET() {
  const blocked = await deny();
  if (blocked) return blocked;
  return NextResponse.json({ ok: true, users: await listUsers() });
}

export async function POST(req: Request) {
  const blocked = await deny();
  if (blocked) return blocked;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = CreateBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const result = await createUser(parsed.data as Parameters<typeof createUser>[0]);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, user: result.user });
}

export async function PATCH(req: Request) {
  const blocked = await deny();
  if (blocked) return blocked;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = UpdateBody.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }
  const result = await updateUser(parsed.data as Parameters<typeof updateUser>[0]);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, user: result.user });
}

export async function DELETE(req: Request) {
  const blocked = await deny();
  if (blocked) return blocked;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  }
  const result = await deleteUser(id);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
