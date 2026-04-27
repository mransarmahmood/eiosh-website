// Admin segment intentionally skips html/body — the root layout owns those.
// AdminShell renders the sidebar and auth gate on each admin page.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
