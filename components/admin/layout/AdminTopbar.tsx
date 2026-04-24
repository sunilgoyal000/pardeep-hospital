"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, Sun, Moon, ChevronDown, ExternalLink, Shield } from "lucide-react";
import { notifications } from "@/data/admin";
import { useAdminRole, AdminRole } from "@/context/AdminRoleContext";

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/patients": "Patients",
  "/admin/doctors": "Doctors",
  "/admin/appointments": "Appointments",
  "/admin/queue": "Live Queue",
  "/admin/departments": "Departments",
  "/admin/pharmacy": "Pharmacy",
  "/admin/reports": "Reports",
  "/admin/notifications": "Notifications",
  "/admin/users": "Users & Roles",
  "/admin/settings": "Settings",
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const { role, setRole } = useAdminRole();
  const [dark, setDark] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const unread = notifications.filter((n) => !n.read).length;
  const pageTitle = breadcrumbMap[pathname] || "Admin";
  const roles: AdminRole[] = ["Super Admin", "Doctor", "Receptionist", "Pharmacist"];

  const toggleDark = () => {
    setDark(!dark);
    document.documentElement.setAttribute("data-admin-theme", dark ? "light" : "dark");
  };

  return (
    <header
      className="sticky top-0 z-30 px-6 py-3 flex items-center gap-4"
      style={{
        background: "var(--admin-card)",
        borderBottom: "1px solid var(--admin-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Breadcrumb */}
      <div className="hidden lg:flex items-center gap-2">
        <Link href="/admin" className="text-xs font-medium" style={{ color: "var(--admin-muted)" }}>Admin</Link>
        {pathname !== "/admin" && (
          <>
            <span style={{ color: "var(--admin-muted)" }}>/</span>
            <span className="text-xs font-semibold" style={{ color: "var(--admin-text)" }}>{pageTitle}</span>
          </>
        )}
      </div>

      {/* Mobile title */}
      <h1 className="lg:hidden text-sm font-bold ml-12" style={{ color: "var(--admin-text)" }}>{pageTitle}</h1>

      {/* Search */}
      <div
        className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl flex-1 max-w-sm mx-auto lg:mx-0"
        style={{
          background: "var(--admin-surface)",
          border: "1px solid var(--admin-border)",
        }}
      >
        <Search className="w-4 h-4 flex-shrink-0" style={{ color: "var(--admin-muted)" }} />
        <input
          type="text"
          placeholder="Search patients, doctors, appointments..."
          className="bg-transparent outline-none text-sm flex-1 min-w-0"
          style={{ color: "var(--admin-text)" }}
        />
        <kbd
          className="hidden md:flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono"
          style={{ background: "var(--admin-border)", color: "var(--admin-muted)" }}
        >
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Link to patient site */}
        <Link
          href="/"
          className="hidden md:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{
            color: "var(--admin-muted)",
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
          }}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Patient Site
        </Link>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all"
            style={{ 
              background: "rgba(13, 148, 136, 0.1)", 
              border: "1px solid rgba(13, 148, 136, 0.2)",
              color: "#0d9488"
            }}
          >
            <Shield className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-wider hidden md:block">{role}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          
          {roleMenuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in duration-200">
                <p className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Select View Role</p>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setRoleMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-colors hover:bg-teal-50"
                    style={{ color: role === r ? "#0d9488" : "var(--admin-text)" }}
                  >
                    {r} {role === r && "✓"}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Dark mode */}
        <button
          onClick={toggleDark}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
          aria-label="Toggle dark mode"
        >
          {dark
            ? <Sun className="w-4 h-4" style={{ color: "#f59e0b" }} />
            : <Moon className="w-4 h-4" style={{ color: "var(--admin-muted)" }} />
          }
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-colors"
            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" style={{ color: "var(--admin-muted)" }} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                {unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div
                className="absolute right-0 top-11 w-80 rounded-2xl overflow-hidden shadow-2xl z-50"
                style={{
                  background: "var(--admin-card)",
                  border: "1px solid var(--admin-border)",
                }}
              >
                <div
                  className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: "var(--admin-border)" }}
                >
                  <span className="font-bold text-sm" style={{ color: "var(--admin-text)" }}>Notifications</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500 text-white">{unread} new</span>
                </div>
                <div className="max-h-80 overflow-y-auto divide-y" style={{ borderColor: "var(--admin-border)" }}>
                  {notifications.map((n) => {
                    const icons: Record<string, string> = { appointment: "📅", queue: "🔢", doctor: "👨‍⚕️", pharmacy: "💊", patient: "🧑", system: "⚙️" };
                    return (
                      <div
                        key={n.id}
                        className="px-4 py-3 flex items-start gap-3"
                        style={{ background: n.read ? "transparent" : "var(--admin-surface)" }}
                      >
                        <span className="text-lg flex-shrink-0">{icons[n.type]}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold" style={{ color: "var(--admin-text)" }}>{n.title}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--admin-muted)" }}>{n.body}</p>
                          <p className="text-xs mt-1" style={{ color: "#0d9488" }}>{n.time}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 mt-1 flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors"
          style={{
            background: "var(--admin-surface)",
            border: "1px solid var(--admin-border)",
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
          >
            {role[0]}
          </div>
          <span className="hidden md:block text-sm font-semibold" style={{ color: "var(--admin-text)" }}>
             {role === "Super Admin" ? "Admin" : role}
          </span>
          <ChevronDown className="hidden md:block w-3.5 h-3.5" style={{ color: "var(--admin-muted)" }} />
        </button>
      </div>
    </header>
  );
}
