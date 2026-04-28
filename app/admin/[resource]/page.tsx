import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus, Edit, Eye, Search, ShieldOff } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { InvoiceListTable } from "@/components/admin/InvoiceListTable";
import { DeleteRecordButton } from "@/components/admin/DeleteRecordButton";
import { getSchema } from "@/lib/cms/schemas";
import { listAll } from "@/lib/cms/store";
import { get } from "@/lib/cms/shape";
import { canSeeModule } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

interface Ctx {
  params: { resource: string };
}

export default async function ResourceListPage({ params }: Ctx) {
  const schema = getSchema(params.resource);
  if (!schema) return notFound();

  // Module-level access guard. Super admin always passes.
  if (!(await canSeeModule(schema.key))) {
    return (
      <AdminShell activeKey={schema.key}>
        <div className="max-w-2xl p-10">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <ShieldOff className="h-8 w-8 text-amber-700" />
            <h1 className="mt-2 text-xl font-heading font-semibold text-amber-900">
              You don't have access to this module.
            </h1>
            <p className="mt-1 text-sm text-amber-800">
              Your account isn't assigned <code className="rounded bg-white px-1">{schema.key}</code>.
              Ask a super admin to grant it in <strong>Users &amp; roles</strong>.
            </p>
          </div>
        </div>
      </AdminShell>
    );
  }

  if (schema.shape === "singleton") {
    const { records } = await listAll(schema.key);
    return (
      <AdminShell activeKey={schema.key}>
        <div className="max-w-4xl p-8 lg:p-12">
          <PageHeader schema={schema} />
          <div className="mt-10 rounded-2xl bg-white p-8 ring-1 ring-border shadow-elevated">
            <ResourceForm schema={schema} initial={records as Record<string, any>} mode="edit" id="_" />
          </div>
        </div>
      </AdminShell>
    );
  }

  const { records } = await listAll(schema.key);
  const list = (records as Record<string, any>[]) ?? [];

  // Invoices get a rich list with totals, filters, status toggle, duplicate, copy-link
  if (schema.key === "invoices") {
    return (
      <AdminShell activeKey={schema.key}>
        <div className="max-w-7xl p-8 lg:p-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <PageHeader schema={schema} />
            <Link
              href={`/admin/${schema.key}/new`}
              className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800"
            >
              <Plus className="h-4 w-4" /> New invoice
            </Link>
          </div>
          <div className="mt-10">
            <InvoiceListTable records={list} />
          </div>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell activeKey={schema.key}>
      <div className="max-w-6xl p-8 lg:p-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <PageHeader schema={schema} />
          <Link
            href={`/admin/${schema.key}/new`}
            className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800"
          >
            <Plus className="h-4 w-4" /> New {schema.singular.toLowerCase()}
          </Link>
        </div>

        {list.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center ring-1 ring-border">
            <Search className="mx-auto h-8 w-8 text-ink-soft" />
            <p className="mt-3 font-heading text-lg font-semibold text-navy-900">No {schema.label.toLowerCase()} yet.</p>
            <p className="mt-1 text-sm text-ink-muted">Create the first record to get started.</p>
          </div>
        ) : (
          <ul className="mt-10 divide-y divide-border rounded-2xl bg-white ring-1 ring-border shadow-elevated">
            {list.map((r) => {
              const id = String(r[schema.idField ?? "id"] ?? "");
              const display = get(r, schema.displayField);
              const sub = schema.subField ? get(r, schema.subField) : null;
              return (
                <li key={id} className="group flex items-center justify-between gap-4 p-5 hover:bg-surface-subtle">
                  <div className="min-w-0">
                    <p className="truncate font-heading font-semibold text-navy-900">
                      {String(display ?? "(untitled)")}
                    </p>
                    {sub ? (
                      <p className="mt-0.5 truncate text-sm text-ink-muted">{String(sub)}</p>
                    ) : null}
                    <p className="mt-0.5 text-xs text-ink-soft">id: {id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/${schema.key}/${id}/view`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-navy-900 ring-1 ring-inset ring-border transition hover:ring-cyan-400 hover:text-cyan-700"
                      aria-label="View record"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </Link>
                    <Link
                      href={`/admin/${schema.key}/${id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-800 ring-1 ring-inset ring-cyan-200 hover:bg-cyan-100"
                      aria-label="Edit record"
                    >
                      <Edit className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <DeleteRecordButton
                      resource={schema.key}
                      id={id}
                      label={`Delete this ${schema.singular.toLowerCase()}`}
                      variant="button"
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}

function PageHeader({ schema }: { schema: { label: string; description?: string } }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Content</p>
      <h1 className="mt-3 font-heading text-3xl font-semibold text-navy-900">{schema.label}</h1>
      {schema.description ? <p className="mt-2 text-ink-muted">{schema.description}</p> : null}
    </div>
  );
}
