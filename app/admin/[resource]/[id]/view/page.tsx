import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { RecordView } from "@/components/admin/RecordView";
import { getSchema } from "@/lib/cms/schemas";
import { readOne } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

interface Ctx {
  params: { resource: string; id: string };
}

export default async function ViewRecord({ params }: Ctx) {
  const schema = getSchema(params.resource);
  if (!schema) return notFound();
  if (schema.shape === "singleton") return notFound();
  const record = await readOne(schema.key, params.id);
  if (!record) return notFound();
  return (
    <AdminShell activeKey={schema.key}>
      <RecordView schema={schema} record={record as Record<string, any>} id={params.id} />
    </AdminShell>
  );
}
