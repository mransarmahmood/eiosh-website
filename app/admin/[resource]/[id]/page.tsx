import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Eye } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { DeleteRecordButton } from "@/components/admin/DeleteRecordButton";
import { DeleteAndRedirect } from "@/components/admin/DeleteAndRedirect";
import { getSchema } from "@/lib/cms/schemas";
import { readOne } from "@/lib/cms/store";
import { get } from "@/lib/cms/shape";

export const dynamic = "force-dynamic";

interface Ctx {
  params: { resource: string; id: string };
}

// Public URL pattern mapping — lets editors jump from an admin record back
// to the rendered page. Only covers resources that have a public detail page.
const publicPath: Record<string, (r: Record<string, unknown>) => string | null> = {
  courses: (r) => (r.slug ? `/courses/${r.slug}` : null),
  trainers: (r) => (r.slug ? `/trainers#${r.slug}` : null),
  blog: (r) => (r.slug ? `/blog/${r.slug}` : null),
  events: (r) => (r.slug ? `/events#${r.slug}` : null),
  "free-courses": (r) => (r.slug ? `/free-courses/${r.slug}` : null),
  resources: (r) => (r.slug ? `/resources#${r.slug}` : null),
};

export default async function EditRecord({ params }: Ctx) {
  const schema = getSchema(params.resource);
  if (!schema) return notFound();
  const record = await readOne(schema.key, params.id);
  if (!record) return notFound();

  const publicHref = publicPath[schema.key]?.(record as Record<string, unknown>) ?? null;
  const displayValue = get(record as Record<string, any>, schema.displayField);

  return (
    <AdminShell activeKey={schema.key}>
      <div className="max-w-4xl p-8 lg:p-12">
        <Link
          href={`/admin/${schema.key}`}
          className="inline-flex items-center gap-1.5 text-sm text-cyan-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {schema.label.toLowerCase()}
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Edit</p>
            <h1 className="mt-3 font-heading text-3xl font-semibold text-navy-900">
              {String(displayValue ?? schema.singular)}
            </h1>
            <p className="mt-1 text-xs text-ink-soft">id: {params.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/${schema.key}/${params.id}/view`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-navy-900 ring-1 ring-inset ring-border hover:ring-cyan-400"
            >
              <Eye className="h-3.5 w-3.5" /> View / Print
            </Link>
            {publicHref ? (
              <Link
                href={publicHref}
                target="_blank"
                className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-navy-900 ring-1 ring-inset ring-border hover:ring-cyan-400"
              >
                <ExternalLink className="h-3.5 w-3.5" /> View public page
              </Link>
            ) : null}
            {schema.shape !== "singleton" ? (
              <DeleteAndRedirect
                resource={schema.key}
                id={params.id}
                label={`Delete this ${schema.singular.toLowerCase()}`}
                redirectTo={`/admin/${schema.key}`}
              />
            ) : null}
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-8 ring-1 ring-border shadow-elevated">
          <ResourceForm schema={schema} initial={record as Record<string, any>} mode="edit" id={params.id} />
        </div>
      </div>
    </AdminShell>
  );
}
