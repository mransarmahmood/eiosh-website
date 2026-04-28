import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/cms/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { listServices } from "@/lib/services";
import { ServicesEditor } from "./ServicesEditor";

export const metadata = { title: "Service catalog" };

export default async function AdminServicesPage() {
  if (!isAuthed()) redirect("/admin/login");
  const services = await listServices();

  return (
    <AdminShell activeKey="services">
      <div className="space-y-6 p-6 lg:p-10">
        <header>
          <h1 className="text-2xl font-heading font-semibold text-navy-900">Service catalog</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Reusable building blocks for proposals + quotations. Add services, set default prices,
            and the proposal builder will let you mix-and-match them per client.
          </p>
        </header>
        <ServicesEditor initial={services} />
      </div>
    </AdminShell>
  );
}
