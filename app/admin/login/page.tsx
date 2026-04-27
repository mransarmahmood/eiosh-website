import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/cms/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Sign in · EIOSH CMS", robots: { index: false } };

export default function LoginPage() {
  if (isAuthed()) redirect("/admin");
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gradient p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-floating ring-1 ring-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-navy-900 font-heading text-white">
            E
          </div>
          <div>
            <h1 className="font-heading text-lg font-semibold text-navy-900">EIOSH CMS</h1>
            <p className="text-xs text-ink-soft">Content administration</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-ink-muted">
          Sign in to edit courses, events, trainers and the rest of the site. Changes apply immediately.
        </p>
        <LoginForm />
        <p className="mt-6 text-xs text-ink-soft">
          Forgotten the password? Set <code className="rounded bg-surface-subtle px-1.5 py-0.5">ADMIN_PASSWORD</code> in{" "}
          <code className="rounded bg-surface-subtle px-1.5 py-0.5">.env.local</code> and restart the dev server.
        </p>
      </div>
    </div>
  );
}
