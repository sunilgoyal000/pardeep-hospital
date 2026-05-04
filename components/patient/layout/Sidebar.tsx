"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  ClipboardList,
  Building2,
  CalendarDays,
  Activity,
  Cross,
  Bell,
  Settings,
  ChevronRight,
} from "lucide-react";
import Logo from "@/components/ui/Logo";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/departments", label: "Departments", icon: Building2 },
  { href: "/queue", label: "Queue Status", icon: ClipboardList },
  { href: "/events", label: "Events", icon: CalendarDays },
];

const quickLinks = [
  { href: "/queue", label: "My Queue", icon: Activity },
  { href: "/departments", label: "Find Doctor", icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-64 z-40"
      style={{
        background: "var(--color-card)",
        borderRight: "1px solid var(--color-border)",
        boxShadow: "4px 0 20px rgb(13 148 136 / 0.06)",
      }}
    >
      {/* Logo */}
      <div
        className="p-6 border-b"
        style={{ borderColor: "var(--color-border)" }}
      >
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <Logo className="w-10 h-10" />
          <div>
            <p
              className="font-black text-lg tracking-tighter leading-none"
              style={{ color: "var(--color-text)" }}
            >
              PARDEEP
            </p>
            <p
              className="text-[10px] font-bold tracking-[0.25em] uppercase text-teal-600 mt-0.5"
            >
              Hospital
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p
          className="text-xs font-semibold uppercase tracking-wider px-3 py-2"
          style={{ color: "var(--color-text-muted)" }}
        >
          Main Menu
        </p>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group"
              style={{
                background: active
                  ? "linear-gradient(135deg, #ccfbf1, #cffafe)"
                  : "transparent",
                color: active ? "var(--color-primary)" : "var(--color-text-muted)",
                fontWeight: active ? "600" : "500",
              }}
            >
              <Icon
                className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{ color: active ? "var(--color-primary)" : undefined }}
              />
              <span className="text-sm">{label}</span>
              {active && (
                <ChevronRight
                  className="w-4 h-4 ml-auto"
                  style={{ color: "var(--color-primary)" }}
                />
              )}
            </Link>
          );
        })}

        <div className="pt-4">
          <p
            className="text-xs font-semibold uppercase tracking-wider px-3 py-2"
            style={{ color: "var(--color-text-muted)" }}
          >
            Quick Access
          </p>
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group hover:bg-teal-50"
              style={{ color: "var(--color-text-muted)", fontWeight: "500" }}
            >
              <Icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-sm">{label}</span>
            </Link>
          ))}
        </div>
        <div className="pt-4">
          <p
            className="text-xs font-semibold uppercase tracking-wider px-3 py-2"
            style={{ color: "var(--color-text-muted)" }}
          >
            Staff Area
          </p>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group hover:bg-slate-100"
            style={{ color: "var(--color-text-muted)", fontWeight: "500" }}
          >
            <Settings className="w-5 h-5 flex-shrink-0 group-hover:rotate-45 transition-transform" />
            <span className="text-sm">Admin Portal</span>
          </Link>
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t" style={{ borderColor: "var(--color-border)" }}>
        {/* Appointment reminder teaser */}
        <div
          className="rounded-xl p-4 mb-3"
          style={{
            background: "linear-gradient(135deg, #0d9488, #0891b2)",
            boxShadow: "0 4px 12px rgb(13 148 136 / 0.25)",
          }}
        >
          <Bell className="w-5 h-5 text-white mb-2" />
          <p className="text-xs font-semibold text-white">Next Appointment</p>
          <p className="text-xs text-teal-100 mt-0.5">Dr. Sharma — Today 3:30 PM</p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
          >
            R
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-semibold truncate"
              style={{ color: "var(--color-text)" }}
            >
              Rahul Kumar
            </p>
            <p
              className="text-xs truncate"
              style={{ color: "var(--color-text-muted)" }}
            >
              Patient ID: PH-2024-001
            </p>
          </div>
          <Settings
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "var(--color-text-muted)" }}
          />
        </div>
      </div>
    </aside>
  );
}
