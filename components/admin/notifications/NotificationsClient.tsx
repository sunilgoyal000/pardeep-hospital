"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { NotificationType, NotificationView } from "@/modules/notifications/schema";

const typeIcons: Record<NotificationType, string> = {
  APPOINTMENT: "📅",
  DOCTOR: "👨‍⚕️",
  PHARMACY: "💊",
  PATIENT: "🧑",
  LAB: "🧪",
  SYSTEM: "⚙️",
};

const typeColors: Record<NotificationType, { bg: string; color: string }> = {
  APPOINTMENT: { bg: "#dbeafe", color: "#1e40af" },
  DOCTOR:      { bg: "#fef3c7", color: "#d97706" },
  PHARMACY:    { bg: "#ede9fe", color: "#7c3aed" },
  PATIENT:     { bg: "#ccfbf1", color: "#0f766e" },
  LAB:         { bg: "#dcfce7", color: "#16a34a" },
  SYSTEM:      { bg: "#f1f5f9", color: "#64748b" },
};

const typeLabel: Record<NotificationType, string> = {
  APPOINTMENT: "Appointment",
  DOCTOR: "Doctor",
  PHARMACY: "Pharmacy",
  PATIENT: "Patient",
  LAB: "Lab",
  SYSTEM: "System",
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const sec = Math.max(0, Math.floor(diffMs / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

interface Props {
  initialNotifications: NotificationView[];
}

type Filter = "all" | NotificationType;

export default function NotificationsClient({ initialNotifications }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [notifs] = useState(initialNotifications);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = notifs.filter((n) => filter === "all" || n.type === filter);
  const unread = notifs.filter((n) => !n.isRead).length;

  async function markAll() {
    const res = await fetch("/api/notifications", { method: "PATCH" });
    if (!res.ok) {
      showToast("Failed to mark all read", "error");
      return;
    }
    showToast("All notifications marked as read", "success");
    router.refresh();
  }

  async function markOne(id: string) {
    const res = await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    if (!res.ok) return;
    router.refresh();
  }

  const filters: Filter[] = ["all", "APPOINTMENT", "DOCTOR", "PHARMACY", "PATIENT", "LAB", "SYSTEM"];

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Notifications</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>
            {unread} unread notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={markAll}
            disabled={unread === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border disabled:opacity-40"
            style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
            style={{
              background: filter === f ? "linear-gradient(135deg,#0d9488,#0891b2)" : "var(--admin-surface)",
              color: filter === f ? "white" : "var(--admin-muted)",
              border: "1px solid var(--admin-border)",
            }}
          >
            {f === "all" ? "All" : typeLabel[f]}
          </button>
        ))}
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
      >
        {filtered.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <Bell className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--admin-muted)" }} />
            <p className="text-sm" style={{ color: "var(--admin-muted)" }}>
              No notifications yet. Book or cancel an appointment to see entries here.
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
            {filtered.map((n) => {
              const palette = typeColors[n.type];
              return (
                <button
                  key={n.id}
                  onClick={() => !n.isRead && markOne(n.id)}
                  className="w-full text-left flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors"
                  style={{ background: n.isRead ? "transparent" : "rgba(13,148,136,0.04)" }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: palette.bg }}
                  >
                    {typeIcons[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold" style={{ color: "var(--admin-text)" }}>
                        {n.title}
                      </p>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: palette.bg, color: palette.color }}
                      >
                        {typeLabel[n.type]}
                      </span>
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>{n.body}</p>
                    <p className="text-xs mt-1" style={{ color: "var(--admin-muted)" }}>
                      {relativeTime(n.createdAt)}
                    </p>
                  </div>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ background: "#0d9488" }} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
