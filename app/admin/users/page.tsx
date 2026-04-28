import { redirect } from "next/navigation";
import { isAuthed, hasPermission, isSuperAdmin } from "@/lib/cms/auth";
import { listUsers } from "@/lib/cms/users";
import { listRoles } from "@/lib/cms/rbac";
import { schemas } from "@/lib/cms/schemas";
import { AdminShell } from "@/components/admin/AdminShell";
import { UsersClient } from "./UsersClient";

export const metadata = { title: "Users & roles" };

export default async function AdminUsersPage() {
  if (!isAuthed()) redirect("/admin/login");
  // Anyone with users:manage can access; super admin always can.
  if (!isSuperAdmin() && !(await hasPermission("users:manage"))) {
    return (
      <AdminShell activeKey="users">
        <div className="p-6 lg:p-10">
          <h1 className="text-xl font-heading font-semibold text-navy-900">No access</h1>
          <p className="mt-2 text-sm text-ink-soft">
            You don't have the <code>users:manage</code> permission. Ask your super admin.
          </p>
        </div>
      </AdminShell>
    );
  }

  const [users] = await Promise.all([listUsers()]);
  const roles = listRoles();
  const moduleKeys = schemas.map((s) => ({ key: s.key, label: s.label }));

  return (
    <AdminShell activeKey="users">
      <div className="space-y-6 p-6 lg:p-10">
        <header>
          <h1 className="text-2xl font-heading font-semibold text-navy-900">
            Users &amp; roles
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Add admins, faculty, advisors, and finance staff. Assign which modules each one can
            access. The legacy single-password gate keeps working alongside this — anyone signed
            in with the master password is treated as a super admin.
          </p>
        </header>

        <UsersClient initial={users} roles={roles} moduleKeys={moduleKeys} />
      </div>
    </AdminShell>
  );
}
