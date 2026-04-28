import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { getSchema } from "@/lib/cms/schemas";
import { canSeeModule } from "@/lib/cms/auth";

export const dynamic = "force-dynamic";

interface Ctx {
  params: { resource: string };
}

export default async function NewRecord({ params }: Ctx) {
  const schema = getSchema(params.resource);
  if (!schema) return notFound();
  if (schema.shape === "singleton") return notFound();
  if (!(await canSeeModule(schema.key))) redirect(`/admin/${params.resource}`);

  return (
    <AdminShell activeKey={schema.key}>
      <div className="max-w-4xl p-8 lg:p-12">
        <Link
          href={`/admin/${schema.key}`}
          className="inline-flex items-center gap-1.5 text-sm text-cyan-700 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to {schema.label.toLowerCase()}
        </Link>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">New</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold text-navy-900">Create {schema.singular.toLowerCase()}</h1>

        <div className="mt-8 rounded-2xl bg-white p-8 ring-1 ring-border shadow-elevated">
          <ResourceForm schema={schema} initial={null} mode="create" />
        </div>
      </div>
    </AdminShell>
  );
}
