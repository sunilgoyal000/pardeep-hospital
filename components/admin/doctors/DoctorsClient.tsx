"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Star, Edit2, Eye } from "lucide-react";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { DoctorAdminView } from "@/modules/doctors/schema";
import EditDoctorModal from "./EditDoctorModal";

type StatusFilter = "All" | "Available" | "Unavailable";

const statusStyles: Record<string, { bg: string; color: string }> = {
  Available:   { bg: "#dcfce7", color: "#16a34a" },
  Unavailable: { bg: "#f1f5f9", color: "#64748b" },
};

interface Props {
  initialDoctors: DoctorAdminView[];
}

export default function DoctorsClient({ initialDoctors }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [doctors] = useState(initialDoctors);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<DoctorAdminView | null>(null);

  const filtered = useMemo(() => {
    return doctors.filter((d) => {
      const status = d.isAvailable ? "Available" : "Unavailable";
      return statusFilter === "All" || status === statusFilter;
    });
  }, [doctors, statusFilter]);

  const summary = useMemo(() => {
    const available = doctors.filter((d) => d.isAvailable).length;
    const unavailable = doctors.length - available;
    const ratings = doctors.map((d) => d.rating).filter((r): r is number => r != null);
    const avgRating =
      ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "—";
    const apptsToday = doctors.reduce((a, d) => a + d.appointmentsToday, 0);
    return { available, unavailable, avgRating, apptsToday };
  }, [doctors]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Doctor Management</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>
            {doctors.length} doctors on staff
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex rounded-xl p-1"
            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
          >
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize"
                style={{
                  background: view === v ? "linear-gradient(135deg,#0d9488,#0891b2)" : "transparent",
                  color: view === v ? "white" : "var(--admin-muted)",
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}
          >
            <Plus className="w-4 h-4" /> Add Doctor
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Available",   value: summary.available,    color: "#22c55e", bg: "#dcfce7" },
          { label: "Unavailable", value: summary.unavailable,  color: "#64748b", bg: "#f1f5f9" },
          { label: "Avg Rating",  value: summary.avgRating,    color: "#f59e0b", bg: "#fef9c3" },
          { label: "Appts Today", value: summary.apptsToday,   color: "#0891b2", bg: "#cffafe" },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold" style={{ background: bg, color }}>
              {value}
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--admin-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1.5">
        {(["All", "Available", "Unavailable"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={{
              background: statusFilter === s ? "linear-gradient(135deg,#0d9488,#0891b2)" : "var(--admin-surface)",
              color: statusFilter === s ? "white" : "var(--admin-muted)",
              border: "1px solid var(--admin-border)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {view === "grid" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => {
            const status = doc.isAvailable ? "Available" : "Unavailable";
            const s = statusStyles[status];
            return (
              <div
                key={doc.id}
                className="rounded-2xl overflow-hidden group"
                style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
              >
                <div className="h-2 w-full" style={{ background: "linear-gradient(90deg,#0d9488,#0891b2)" }} />
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {doc.imageUrl ? (
                      <Image src={doc.imageUrl} alt={doc.name} width={56} height={56} className="w-14 h-14 rounded-2xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
                        style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}>
                        {doc.name[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-sm leading-tight" style={{ color: "var(--admin-text)" }}>{doc.name}</p>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: s.bg, color: s.color }}>
                          {status}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "var(--admin-muted)" }}>{doc.department ?? doc.specialty}</p>
                      {doc.rating != null && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs font-semibold" style={{ color: "var(--admin-text)" }}>{doc.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {[
                      { label: "Exp", value: doc.experienceYears != null ? `${doc.experienceYears}yr` : "—" },
                      { label: "Patients", value: doc.patientsLifetime > 999 ? `${(doc.patientsLifetime / 1000).toFixed(1)}K` : doc.patientsLifetime },
                      { label: "Today", value: doc.appointmentsToday },
                    ].map(({ label, value }) => (
                      <div key={label} className="rounded-xl p-2 text-center" style={{ background: "var(--admin-surface)" }}>
                        <p className="text-sm font-bold" style={{ color: "var(--admin-text)" }}>{value}</p>
                        <p className="text-xs" style={{ color: "var(--admin-muted)" }}>{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => showToast(`Schedule view lands in a follow-up PR`, "info")}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-teal-50"
                      style={{ border: "1px solid var(--admin-border)", color: "var(--admin-text)" }}
                    >
                      Schedule
                    </button>
                    <button
                      onClick={() => setEditing(doc)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold text-white"
                      style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-full py-10 text-center text-sm" style={{ color: "var(--admin-muted)" }}>
              No doctors match the current filter.
            </div>
          )}
        </div>
      )}

      {view === "list" && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                {["Doctor", "Department", "Experience", "Patients", "Appts Today", "Rating", "Status", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--admin-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
              {filtered.map((doc) => {
                const status = doc.isAvailable ? "Available" : "Unavailable";
                const s = statusStyles[status];
                return (
                  <tr key={doc.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {doc.imageUrl ? (
                          <Image src={doc.imageUrl} alt={doc.name} width={36} height={36} className="w-9 h-9 rounded-xl object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                            style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}>
                            {doc.name[0]}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "var(--admin-text)" }}>{doc.name}</p>
                          <p className="text-xs" style={{ color: "var(--admin-muted)" }}>{doc.id.slice(-8)} · ₹{doc.consultFee}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--admin-muted)" }}>{doc.department ?? doc.specialty}</td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--admin-muted)" }}>
                      {doc.experienceYears != null ? `${doc.experienceYears} yr` : "—"}
                    </td>
                    <td className="px-5 py-4 text-sm font-medium" style={{ color: "var(--admin-text)" }}>
                      {doc.patientsLifetime.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--admin-text)" }}>{doc.appointmentsToday}</td>
                    <td className="px-5 py-4">
                      {doc.rating != null ? (
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="text-sm font-semibold" style={{ color: "var(--admin-text)" }}>{doc.rating.toFixed(1)}</span>
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--admin-muted)" }}>—</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                        {status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => showToast(`Viewing ${doc.name}`)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-teal-50 transition-colors">
                          <Eye className="w-3.5 h-3.5 text-teal-600" />
                        </button>
                        <button onClick={() => setEditing(doc)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors">
                          <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-sm" style={{ color: "var(--admin-muted)" }}>
                    No doctors match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <EditDoctorModal
        doctor={editing}
        onClose={() => setEditing(null)}
        onSuccess={() => router.refresh()}
      />

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl" style={{ background: "var(--admin-card)" }}>
              <h2 className="font-bold text-lg mb-3" style={{ color: "var(--admin-text)" }}>Add New Doctor</h2>
              <p className="text-xs" style={{ color: "var(--admin-muted)" }}>
                Doctor onboarding requires a user-creation flow (account + password setup) and lands alongside
                the user-management page so auth, audit, and profile setup live on one path.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                  style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
