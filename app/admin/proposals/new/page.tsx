import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/cms/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { listTemplates } from "@/lib/proposals";
import { listServices } from "@/lib/services";
import { ProposalBuilder } from "./ProposalBuilder";

export const metadata = { title: "Send a proposal" };

export default async function NewProposalPage() {
  if (!isAuthed()) redirect("/admin/login");
  const [templates, services] = await Promise.all([listTemplates(), listServices()]);

  return (
    <AdminShell activeKey="proposals/new">
      <div className="space-y-6 p-6 lg:p-10">
        <header>
          <h1 className="text-2xl font-heading font-semibold text-navy-900">
            Send a proposal
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Pick a template, fill in client details, tweak the line items, save. The proposal
            gets a public link you can email or share.
          </p>
        </header>
        <ProposalBuilder templates={templates} services={services} />
      </div>
    </AdminShell>
  );
}
