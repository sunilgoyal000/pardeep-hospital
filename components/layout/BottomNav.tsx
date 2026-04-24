"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, ClipboardList, CalendarDays } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/departments", label: "Depts", icon: Building2 },
  { href: "/queue", label: "Queue", icon: ClipboardList },
  { href: "/events", label: "Events", icon: CalendarDays },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        background: "var(--color-card)",
        borderTop: "1px solid var(--color-border)",
        boxShadow: "0 -4px 20px rgb(13 148 136 / 0.08)",
      }}
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200"
              style={{ minWidth: "60px" }}
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
                style={{
                  background: active
                    ? "linear-gradient(135deg, #0d9488, #0891b2)"
                    : "transparent",
                  transform: active ? "scale(1.1)" : "scale(1)",
                }}
              >
                <Icon
                  className="w-5 h-5 transition-colors"
                  style={{ color: active ? "white" : "var(--color-text-muted)" }}
                />
              </div>
              <span
                className="text-xs font-medium transition-colors"
                style={{
                  color: active ? "var(--color-primary)" : "var(--color-text-muted)",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
