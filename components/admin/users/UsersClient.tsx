"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Shield, ShieldCheck, ShieldAlert, User, Stethoscope, Pill, FlaskConical, Power } from "lucide-react";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { Role, UserAdminView } from "@/modules/users/schema";
import CreateUserModal from "./CreateUserModal";

const roleStyles: Record<Role, { bg: string; color: string; icon: React.ElementType; label: string }> = {
  SUPER_ADMIN: { bg: "#fee2e2", color: "#dc2626", icon: ShieldAlert, label: "Super Admin" },
  ADMIN:       { bg: "#ede9fe", color: "#7c3aed", icon: ShieldCheck, label: "Admin" },
  DOCTOR:      { bg: "#cffafe", color: "#0891b2", icon: Stethoscope, label: "Doctor" },
  PATIENT:     { bg: "#dcfce7", color: "#16a34a", icon: User,        label: "Patient" },
  PHARMACY:    { bg: "#fef3c7", color: "#d97706", icon: Pill,        label: "Pharmacy" },
  LAB:         { bg: "#f1f5f9", color: "#64748b", icon: FlaskConical, label: "Lab" },
};

function relativeTime(iso: string | null): string {
  if (!iso) return "Never";
  const diffMs = Date.now() - new Date(iso).getTime();
  const sec = Math.max(0, Math.floor(diffMs / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const days = Math.floor(hr / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

interface Props {
  initialUsers: UserAdminView[];
  currentUserId: string;
}

export default function UsersClient({ initialUsers, currentUserId }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [users] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [roleFilter, setRoleFilter] = useState<"All" | Role>("All");
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(
    () => users.filter((u) => roleFilter === "All" || u.role === roleFilter),
    [users, roleFilter]
  );

  const summaryCards: Array<{ key: Role | "STAFF"; label: string; count: number; color: string; bg: string; icon: React.ElementType }> = [
    {
      key: "ADMIN",
      label: "Admins",
      count: users.filter((u) => u.role === "SUPER_ADMIN" || u.role === "ADMIN").length,
      color: "#7c3aed",
      bg: "#ede9fe",
      icon: ShieldCheck,
    },
    {
      key: "DOCTOR",
      label: "Doctors",
      count: users.filter((u) => u.role === "DOCTOR").length,
      color: "#0891b2",
      bg: "#cffafe",
      icon: Stethoscope,
    },
    {
      key: "PATIENT",
      label: "Patients",
      count: users.filter((u) => u.role === "PATIENT").length,
      color: "#16a34a",
      bg: "#dcfce7",
      icon: User,
    },
    {
      key: "STAFF",
      label: "Other Staff",
      count: users.filter((u) => u.role === "PHARMACY" || u.role === "LAB").length,
      color: "#d97706",
      bg: "#fef3c7",
      icon: Pill,
    },
  ];

  async function toggleActive(u: UserAdminView) {
    if (u.id === currentUserId) {
      showToast("You can't deactivate yourself", "error");
      return;
    }
    setBusyId(u.id);
    try {
      const res = await fetch(`/api/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !u.isActive }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        showToast(body.message || "Failed to update user", "error");
        return;
      }
      showToast(u.isActive ? `${u.name} deactivated` : `${u.name} reactivated`, u.isActive ? "info" : "success");
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Users &amp; Role Management</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>
            {users.length.toLocaleString()} accounts · control access and staff permissions
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(({ key, label, count, color, bg, icon: Icon }) => (
          <div
            key={key}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: "var(--admin-text)" }}>{count}</p>
              <p className="text-xs font-medium" style={{ color: "var(--admin-muted)" }}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {(["All", "SUPER_ADMIN", "ADMIN", "DOCTOR", "PATIENT", "PHARMACY", "LAB"] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: roleFilter === r ? "linear-gradient(135deg,#0d9488,#0891b2)" : "var(--admin-surface)",
              color: roleFilter === r ? "white" : "var(--admin-muted)",
              border: "1px solid var(--admin-border)",
            }}
          >
            {r === "All" ? "All" : roleStyles[r].label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--admin-border)" }}>
                {["User", "Role", "Department", "Status", "Last Login", ""].map((h, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider ${idx === 5 ? "text-right" : ""}`}
                    style={{ color: "var(--admin-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
              {filtered.map((u) => {
                const style = roleStyles[u.role];
                const Icon = style.icon;
                const isMe = u.id === currentUserId;
                return (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
                        >
                          {(u.name || u.email)[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold flex items-center gap-2" style={{ color: "var(--admin-text)" }}>
                            {u.name || "—"}
                            {isMe && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: "#ccfbf1", color: "#0f766e" }}>
                                you
                              </span>
                            )}
                          </p>
                          <p className="text-xs" style={{ color: "var(--admin-muted)" }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg w-fit text-xs font-semibold"
                        style={{ background: style.bg, color: style.color }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {style.label}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "var(--admin-muted)" }}>
                      {u.department ?? "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: u.isActive ? "#dcfce7" : "#fee2e2",
                          color: u.isActive ? "#16a34a" : "#dc2626",
                        }}
                      >
                        {u.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "var(--admin-muted)" }}>
                      {relativeTime(u.lastLoginAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => toggleActive(u)}
                        disabled={busyId === u.id || isMe}
                        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border disabled:opacity-40"
                        style={{
                          background: u.isActive ? "#fee2e2" : "#dcfce7",
                          color: u.isActive ? "#dc2626" : "#16a34a",
                          borderColor: "transparent",
                        }}
                        title={isMe ? "You can't deactivate yourself" : u.isActive ? "Deactivate" : "Reactivate"}
                      >
                        <Power className="w-3.5 h-3.5" />
                        {busyId === u.id ? "…" : u.isActive ? "Deactivate" : "Reactivate"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm" style={{ color: "var(--admin-muted)" }}>
                    No users match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateUserModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
