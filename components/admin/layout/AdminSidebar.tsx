"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, UserRound, CalendarDays, ClipboardList,
  Building2, Pill, BarChart3, Bell, Shield, Settings, ChevronLeft,
  ChevronRight, Cross, Activity, Menu, X,
} from "lucide-react";
import { useAdminRole } from "@/context/AdminRoleContext";
import Logo from "@/components/ui/Logo";

const navGroups = [
  {
    label: "Core",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/patients", label: "Patients", icon: Users, badge: "12.8K", roles: ["Super Admin", "Doctor", "Receptionist"] },
      { href: "/admin/doctors", label: "Doctors", icon: UserRound, roles: ["Super Admin"] },
      { href: "/admin/appointments", label: "Appointments", icon: CalendarDays, badge: "128", roles: ["Super Admin", "Doctor", "Receptionist"] },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/admin/queue", label: "Live Queue", icon: Activity, badge: "34", badgeColor: "#22c55e", roles: ["Super Admin", "Receptionist"] },
      { href: "/admin/departments", label: "Departments", icon: Building2, roles: ["Super Admin", "Doctor"] },
      { href: "/admin/pharmacy", label: "Pharmacy", icon: Pill, roles: ["Super Admin", "Pharmacist"] },
    ],
  },
  {
    label: "Insights",
    items: [
      { href: "/admin/reports", label: "Reports", icon: BarChart3, roles: ["Super Admin"] },
      { href: "/admin/notifications", label: "Notifications", icon: Bell, badge: "3", badgeColor: "#ef4444" },
    ],
  },
  {
    label: "Admin",
    items: [
      { href: "/admin/users", label: "Users & Roles", icon: Shield, roles: ["Super Admin"] },
      { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["Super Admin"] },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { role } = useAdminRole();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Filter groups and items based on role
  const filteredGroups = navGroups.map(group => ({
    ...group,
    items: group.items.filter(item => !item.roles || item.roles.includes(role))
  })).filter(group => group.items.length > 0);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5 border-b"
        style={{ borderColor: "var(--admin-border)" }}
      >
        <Logo className="w-9 h-9" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-black text-sm leading-tight tracking-tighter" style={{ color: "var(--admin-text)" }}>PARDEEP</p>
            <p className="text-[10px] font-bold tracking-widest text-teal-600 uppercase">Admin Portal</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto hidden lg:flex w-7 h-7 rounded-lg items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" style={{ color: "var(--admin-muted)" }} />
            : <ChevronLeft className="w-4 h-4" style={{ color: "var(--admin-muted)" }} />
          }
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {filteredGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p
                className="text-xs font-semibold uppercase tracking-wider px-2 mb-1"
                style={{ color: "var(--admin-muted)" }}
              >
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ href, label, icon: Icon, badge, badgeColor }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative"
                    style={{
                      background: active ? "linear-gradient(135deg, #ccfbf1, #cffafe)" : "transparent",
                      color: active ? "#0d9488" : "var(--admin-muted)",
                      fontWeight: active ? "600" : "500",
                    }}
                    title={collapsed ? label : undefined}
                  >
                    <Icon
                      className="w-[18px] h-[18px] flex-shrink-0 transition-transform duration-150 group-hover:scale-110"
                      style={{ color: active ? "#0d9488" : undefined }}
                    />
                    {!collapsed && (
                      <>
                        <span className="text-sm flex-1">{label}</span>
                        {badge && (
                          <span
                            className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                            style={{ background: badgeColor || "#0d9488", fontSize: "10px" }}
                          >
                            {badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom profile */}
      <div
        className="p-4 border-t"
        style={{ borderColor: "var(--admin-border)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
          >
            {role[0]}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--admin-text)" }}>
                {role === "Super Admin" ? "Dr. Sunil Gupta" : role === "Doctor" ? "Dr. Sharma" : "Staff User"}
              </p>
              <p className="text-xs truncate font-bold text-teal-600" style={{ fontSize: "10px" }}>{role.toUpperCase()}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg"
        style={{ background: "var(--admin-card)" }}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5" style={{ color: "var(--admin-text)" }} /> : <Menu className="w-5 h-5" style={{ color: "var(--admin-text)" }} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className="lg:hidden fixed top-0 left-0 h-full w-64 z-50 transition-transform duration-300"
        style={{
          background: "var(--admin-card)",
          borderRight: "1px solid var(--admin-border)",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 transition-all duration-300"
        style={{
          width: collapsed ? "72px" : "240px",
          background: "var(--admin-card)",
          borderRight: "1px solid var(--admin-border)",
          boxShadow: "2px 0 12px rgb(0 0 0 / 0.04)",
        }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
