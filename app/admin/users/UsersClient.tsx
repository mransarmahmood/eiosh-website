"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Loader2, Check, UserPlus, ShieldCheck, X } from "lucide-react";
import type { SafeAdminUser } from "@/lib/cms/users";

type RoleKey = string;
interface ModuleEntry {
  key: string;
  label: string;
}

interface Props {
  initial: SafeAdminUser[];
  roles: RoleKey[];
  moduleKeys: ModuleEntry[];
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  admin: "Super admin — full access to every module + can manage other users.",
  faculty: "Edit course content, blog, events, IV records.",
  advisor: "Read content + create proposals + manage cohorts.",
  finance: "Invoices, quotations, refunds.",
  iv: "Internal verifier — IV/EQA records and read-only content.",
};

const ROLE_DEFAULT_MODULES: Record<string, string[]> = {
  admin: ["*"],
  faculty: ["courses", "categories", "trainers", "blog", "events", "testimonials", "free-courses", "faqs", "resources", "certificates"],
  advisor: ["courses", "blog", "events", "trainers", "proposals", "quotations", "admissions", "registrations"],
  finance: ["invoices", "quotations", "proposals"],
  iv: ["certificates", "courses"],
};

function emptyDraft(): {
  email: string;
  name: string;
  password: string;
  role: RoleKey;
  modules: string[];
  active: boolean;
} {
  return {
    email: "",
    name: "",
    password: "",
    role: "advisor",
    modules: ROLE_DEFAULT_MODULES.advisor,
    active: true,
  };
}

export function UsersClient({ initial, roles, moduleKeys }: Props) {
  const [users, setUsers] = useState<SafeAdminUser[]>(initial);
  const [showNew, setShowNew] = useState(false);
  const [draft, setDraft] = useState(emptyDraft());
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPwd, setEditPwd] = useState<Record<string, string>>({});

  function pickRoleForDraft(role: RoleKey) {
    setDraft((d) => ({
      ...d,
      role,
      modules: ROLE_DEFAULT_MODULES[role] ?? ["*"],
    }));
  }

  async function createUser() {
    setSaving(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrorMsg(json.error ?? "Could not create user.");
        return;
      }
      setUsers((u) => [...u, json.user]);
      setDraft(emptyDraft());
      setShowNew(false);
    } finally {
      setSaving(false);
    }
  }

  async function patchUser(id: string, patch: Partial<SafeAdminUser> & { newPassword?: string }) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...patch }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setUsers((all) => all.map((u) => (u.id === id ? json.user : u)));
        setEditPwd((m) => ({ ...m, [id]: "" }));
      }
    } finally {
      setSaving(false);
    }
  }

  async function removeUser(id: string) {
    if (!confirm("Delete this user? They'll lose access immediately.")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setUsers((u) => u.filter((x) => x.id !== id));
      } else {
        alert(json.error ?? "Could not delete.");
      }
    } finally {
      setSaving(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* New user button + form */}
      {!showNew && (
        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
        >
          <UserPlus className="h-4 w-4" /> Add a user
        </button>
      )}

      {showNew && (
        <div className="rounded-2xl border border-cyan-200 bg-cyan-50/40 p-5">
          <header className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-navy-900">Add a user</h2>
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="rounded p-1 text-ink-soft hover:bg-white"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </header>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Field label="Full name" required>
              <Input
                value={draft.name}
                onChange={(v) => setDraft({ ...draft, name: v })}
              />
            </Field>
            <Field label="Email" required>
              <Input
                type="email"
                value={draft.email}
                onChange={(v) => setDraft({ ...draft, email: v.trim().toLowerCase() })}
              />
            </Field>
            <Field label="Initial password" required>
              <Input
                type="password"
                placeholder="min 8 characters"
                value={draft.password}
                onChange={(v) => setDraft({ ...draft, password: v })}
              />
            </Field>
            <Field label="Role" required>
              <select
                value={draft.role}
                onChange={(e) => pickRoleForDraft(e.target.value)}
                className="block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-ink-soft">
                {ROLE_DESCRIPTIONS[draft.role] ?? ""}
              </p>
            </Field>
            <Field label="Modules they can access" wide>
              <ModuleCheckboxes
                value={draft.modules}
                onChange={(m) => setDraft({ ...draft, modules: m })}
                options={moduleKeys}
              />
            </Field>
          </div>
          {errorMsg && (
            <p className="mt-3 text-sm text-red-700" role="alert">
              {errorMsg}
            </p>
          )}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={createUser}
              disabled={saving || !draft.email || !draft.name || draft.password.length < 8}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-navy-900 px-4 text-sm font-semibold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create user
            </button>
          </div>
        </div>
      )}

      {/* Users list */}
      <ul className="space-y-3">
        {users.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-ink-soft">
            No additional users yet. The master password (set in Settings or env) still works as
            super-admin.
          </li>
        )}
        {users.map((u) => {
          const isEditing = editingId === u.id;
          return (
            <li
              key={u.id}
              className="rounded-2xl border border-border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-navy-900">{u.name}</p>
                  <p className="text-xs text-ink-soft">
                    {u.email} · <span className="rounded bg-navy-50 px-1.5 capitalize">{u.role}</span>
                    {!u.active && <span className="ml-2 rounded bg-red-50 px-1.5 text-red-700">inactive</span>}
                  </p>
                  <p className="mt-2 text-[0.7rem] text-ink-soft">
                    {u.modules.includes("*")
                      ? "All modules"
                      : `${u.modules.length} module${u.modules.length === 1 ? "" : "s"}: ${u.modules.slice(0, 4).join(", ")}${u.modules.length > 4 ? "…" : ""}`}
                  </p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingId(isEditing ? null : u.id)}
                    className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-navy-50"
                  >
                    {isEditing ? "Close" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeUser(u.id)}
                    className="rounded-lg border border-red-200 p-1.5 text-red-700 hover:bg-red-50"
                    aria-label="Delete user"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-4 space-y-3 border-t border-border pt-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Name">
                      <Input
                        value={u.name}
                        onChange={(v) =>
                          setUsers((all) =>
                            all.map((x) => (x.id === u.id ? { ...x, name: v } : x)),
                          )
                        }
                      />
                    </Field>
                    <Field label="Role">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          setUsers((all) =>
                            all.map((x) =>
                              x.id === u.id
                                ? {
                                    ...x,
                                    role: e.target.value as typeof x.role,
                                    modules: ROLE_DEFAULT_MODULES[e.target.value] ?? x.modules,
                                  }
                                : x,
                            ),
                          )
                        }
                        className="block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                      >
                        {roles.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Active">
                      <label className="flex h-10 items-center gap-2">
                        <input
                          type="checkbox"
                          checked={u.active}
                          onChange={(e) =>
                            setUsers((all) =>
                              all.map((x) => (x.id === u.id ? { ...x, active: e.target.checked } : x)),
                            )
                          }
                        />
                        <span className="text-sm">Account active</span>
                      </label>
                    </Field>
                    <Field label="Reset password (leave blank to keep)">
                      <Input
                        type="password"
                        placeholder="min 8 chars"
                        value={editPwd[u.id] ?? ""}
                        onChange={(v) => setEditPwd((m) => ({ ...m, [u.id]: v }))}
                      />
                    </Field>
                  </div>
                  <Field label="Modules" wide>
                    <ModuleCheckboxes
                      value={u.modules}
                      onChange={(m) =>
                        setUsers((all) =>
                          all.map((x) => (x.id === u.id ? { ...x, modules: m } : x)),
                        )
                      }
                      options={moduleKeys}
                    />
                  </Field>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        patchUser(u.id, {
                          name: u.name,
                          role: u.role,
                          modules: u.modules,
                          active: u.active,
                          newPassword: editPwd[u.id] || undefined,
                        })
                      }
                      disabled={saving}
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-navy-900 px-4 text-sm font-semibold text-white hover:bg-navy-800 disabled:cursor-wait"
                    >
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Save changes
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ── small UI helpers ──────────────────────────────────────────────────────
function Field({
  label,
  required,
  wide,
  children,
}: {
  label: string;
  required?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${wide ? "md:col-span-2" : ""}`}>
      <span className="text-xs font-medium uppercase tracking-wider text-ink-soft">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </span>
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
    />
  );
}

function ModuleCheckboxes({
  value,
  onChange,
  options,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  options: ModuleEntry[];
}) {
  const allOn = value.includes("*");

  return (
    <div className="rounded-lg border border-border bg-white p-3">
      <label className="flex items-center gap-2 border-b border-border pb-2 text-sm font-medium text-navy-900">
        <input
          type="checkbox"
          checked={allOn}
          onChange={(e) => onChange(e.target.checked ? ["*"] : [])}
        />
        <ShieldCheck className="h-4 w-4 text-cyan-700" />
        Grant access to <strong>all modules</strong>
      </label>
      <p className="mt-2 text-[0.7rem] text-ink-soft">
        Or pick specific modules:
      </p>
      <div className="mt-1 grid grid-cols-1 gap-1 sm:grid-cols-2">
        {options.map((m) => {
          const checked = !allOn && value.includes(m.key);
          return (
            <label key={m.key} className="flex items-center gap-2 rounded px-1 py-0.5 text-xs hover:bg-navy-50">
              <input
                type="checkbox"
                disabled={allOn}
                checked={checked}
                onChange={(e) => {
                  const next = new Set(value.filter((v) => v !== "*"));
                  if (e.target.checked) next.add(m.key);
                  else next.delete(m.key);
                  onChange(Array.from(next));
                }}
              />
              <span>{m.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
