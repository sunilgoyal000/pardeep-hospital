"use client";
import { useState } from "react";
import { Bell, CheckCheck, Trash2, Filter } from "lucide-react";
import { notifications } from "@/data/admin";
import { useToast } from "@/components/admin/ui/ToastProvider";

type NotifType = "all" | "appointment" | "queue" | "doctor" | "pharmacy" | "patient" | "system";

const typeIcons: Record<string, string> = {
  appointment: "📅", queue: "🔢", doctor: "👨‍⚕️", pharmacy: "💊", patient: "🧑", system: "⚙️",
};
const typeColors: Record<string, { bg: string; color: string }> = {
  appointment: { bg: "#dbeafe", color: "#1e40af" },
  queue:       { bg: "#dcfce7", color: "#16a34a" },
  doctor:      { bg: "#fef3c7", color: "#d97706" },
  pharmacy:    { bg: "#ede9fe", color: "#7c3aed" },
  patient:     { bg: "#ccfbf1", color: "#0f766e" },
  system:      { bg: "#f1f5f9", color: "#64748b" },
};

export default function NotificationsPage() {
  const { showToast } = useToast();
  const [notifs, setNotifs] = useState(notifications);
  const [filter, setFilter] = useState<NotifType>("all");

  const filtered = notifs.filter((n) => filter === "all" || n.type === filter);
  const unread = notifs.filter((n) => !n.read).length;

  const markAll = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast("All notifications marked as read", "success");
  };

  const deleteAll = () => {
    setNotifs([]);
    showToast("All notifications cleared", "info");
  };

  const markOne = (id: number) => {
    setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  const deleteOne = (id: number) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  };

  const filters: NotifType[] = ["all", "appointment", "queue", "doctor", "pharmacy", "patient", "system"];

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
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
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-green-50"
            style={{ border: "1px solid var(--admin-border)", color: "#16a34a" }}
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
          <button
            onClick={deleteAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-red-50"
            style={{ border: "1px solid var(--admin-border)", color: "#dc2626" }}
          >
            <Trash2 className="w-4 h-4" /> Clear all
          </button>
        </div>
      </div>

      {/* Type filter chips */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all"
            style={{
              background: filter === f ? "linear-gradient(135deg,#0d9488,#0891b2)" : "var(--admin-card)",
              color: filter === f ? "white" : "var(--admin-muted)",
              border: `1px solid var(--admin-border)`,
            }}
          >
            {f !== "all" && <span>{typeIcons[f]}</span>}
            {f}
            {f !== "all" && (
              <span
                className="text-xs font-bold px-1.5 rounded-full"
                style={{
                  background: filter === f ? "rgba(255,255,255,0.25)" : "var(--admin-surface)",
                  color: filter === f ? "white" : "var(--admin-muted)",
                }}
              >
                {notifs.filter((n) => n.type === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
      >
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <Bell className="w-12 h-12" style={{ color: "var(--admin-border)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--admin-muted)" }}>No notifications</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
            {filtered.map((n) => {
              const tc = typeColors[n.type] || typeColors.system;
              return (
                <div
                  key={n.id}
                  className="flex items-start gap-4 px-5 py-4 group transition-colors"
                  style={{ background: n.read ? "transparent" : "var(--admin-surface)" }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: tc.bg }}
                  >
                    {typeIcons[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--admin-text)" }}
                      >
                        {n.title}
                      </p>
                      {!n.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>{n.body}</p>
                    <p className="text-xs mt-1 font-medium" style={{ color: "#0d9488" }}>{n.time}</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    {!n.read && (
                      <button
                        onClick={() => markOne(n.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-green-50"
                        title="Mark as read"
                      >
                        <CheckCheck className="w-3.5 h-3.5 text-green-500" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteOne(n.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notification settings teaser */}
      <div
        className="rounded-2xl p-5 flex items-start gap-4"
        style={{
          background: "linear-gradient(135deg, #0d9488, #0891b2)",
          boxShadow: "0 8px 24px rgb(13 148 136 / 0.25)",
        }}
      >
        <Bell className="w-8 h-8 text-white flex-shrink-0" />
        <div>
          <h3 className="text-white font-bold">Notification Channels</h3>
          <p className="text-teal-100 text-sm mt-1">
            Configure SMS, WhatsApp, and email alerts for appointments, queue updates, and critical patient events.
          </p>
          <div className="flex gap-2 mt-3">
            {["SMS", "WhatsApp", "Email"].map((ch) => (
              <button
                key={ch}
                className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors"
                onClick={() => showToast(`${ch} notifications configured`, "success")}
              >
                {ch} ✓
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
