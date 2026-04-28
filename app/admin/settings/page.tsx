import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/cms/auth";
import { AdminShell } from "@/components/admin/AdminShell";
import { readAllSettings } from "@/lib/runtime-config";
import { SettingsForm } from "./SettingsForm";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  if (!isAuthed()) redirect("/admin/login");
  const settings = await readAllSettings();
  // Mask sensitive values before sending to the client.
  const masked = settings.map((s) => ({
    key: s.key,
    isSet: s.isSet,
    isSensitive: s.isSensitive,
    value: s.isSensitive && s.value ? "" : s.value, // empty = "leave blank to keep current"
    placeholder: s.isSensitive && s.isSet ? "•••••• (set — type to overwrite)" : "",
  }));

  return (
    <AdminShell activeKey="settings">
      <div className="space-y-6 p-6 lg:p-10">
        <header>
          <h1 className="text-2xl font-heading font-semibold text-navy-900">Settings &amp; API keys</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Set API keys and provider choices here. Values save to{" "}
            <code className="rounded bg-ink/5 px-1">content/data/runtime-config.json</code>{" "}
            and override environment variables on the next request — no restart needed.
          </p>
        </header>

        <SettingsForm initial={masked} />
      </div>
    </AdminShell>
  );
}
