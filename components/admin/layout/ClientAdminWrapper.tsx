"use client";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/layout/AdminSidebar";
import AdminTopbar from "@/components/admin/layout/AdminTopbar";
import CommandPalette from "@/components/admin/ui/CommandPalette";

export default function ClientAdminWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="min-h-screen bg-slate-50">{children}</div>;
  }

  return (
    <div
      className="min-h-screen"
      style={{
        // Admin CSS variables
        "--admin-surface": "#f8fafc",
        "--admin-card": "#ffffff",
        "--admin-border": "#e2e8f0",
        "--admin-text": "#0f172a",
        "--admin-muted": "#64748b",
        "--admin-primary": "#0d9488",
        "--admin-accent": "#0891b2",
      } as React.CSSProperties}
    >
      <CommandPalette />
      <AdminSidebar />

      <div
        className="lg:ml-60 transition-all duration-300 flex flex-col min-h-screen"
        style={{ background: "var(--admin-surface)" }}
      >
        <AdminTopbar />
        <main className="flex-1 p-5 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
