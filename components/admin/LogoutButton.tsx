"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  async function onClick() {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-red-50 hover:text-red-700 cursor-pointer"
    >
      <LogOut className="h-4 w-4" /> Sign out
    </button>
  );
}
