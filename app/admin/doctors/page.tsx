"use client";
import { useState } from "react";
import { Plus, Star, Phone, Mail, Edit2, Trash2, Eye, MoreHorizontal, TrendingUp } from "lucide-react";
import { adminDoctors } from "@/data/admin";
import { useToast } from "@/components/admin/ui/ToastProvider";

const statusStyles: Record<string, { bg: string; color: string }> = {
  Active: { bg: "#dcfce7", color: "#16a34a" },
  Leave: { bg: "#fef3c7", color: "#d97706" },
  Inactive: { bg: "#f1f5f9", color: "#64748b" },
};

export default function DoctorsPage() {
  const { showToast } = useToast();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Doctor Management</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>{adminDoctors.length} doctors on staff</p>
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
            style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
          >
            <Plus className="w-4 h-4" /> Add Doctor
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active", value: adminDoctors.filter((d) => d.status === "Active").length, color: "#22c55e", bg: "#dcfce7" },
          { label: "On Leave", value: adminDoctors.filter((d) => d.status === "Leave").length, color: "#d97706", bg: "#fef3c7" },
          { label: "Avg Rating", value: "4.8", color: "#f59e0b", bg: "#fef9c3" },
          { label: "Appts Today", value: adminDoctors.reduce((a, d) => a + (d.available ? d.appointments : 0), 0), color: "#0891b2", bg: "#cffafe" },
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

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminDoctors.map((doc) => {
            const s = statusStyles[doc.status];
            return (
              <div
                key={doc.id}
                className="rounded-2xl overflow-hidden group"
                style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
              >
                {/* Top gradient strip */}
                <div className="h-2 w-full" style={{ background: "linear-gradient(90deg,#0d9488,#0891b2)" }} />
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-bold text-sm leading-tight" style={{ color: "var(--admin-text)" }}>{doc.name}</p>
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                          style={{ background: s.bg, color: s.color }}
                        >
                          {doc.status}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "var(--admin-muted)" }}>{doc.dept}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold" style={{ color: "var(--admin-text)" }}>{doc.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {[
                      { label: "Exp", value: `${doc.experience}yr` },
                      { label: "Patients", value: `${(doc.patients / 1000).toFixed(1)}K` },
                      { label: "Today", value: doc.appointments },
                    ].map(({ label, value }) => (
                      <div
                        key={label}
                        className="rounded-xl p-2 text-center"
                        style={{ background: "var(--admin-surface)" }}
                      >
                        <p className="text-sm font-bold" style={{ color: "var(--admin-text)" }}>{value}</p>
                        <p className="text-xs" style={{ color: "var(--admin-muted)" }}>{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => showToast(`Viewing ${doc.name}'s schedule`)}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-teal-50"
                      style={{ border: "1px solid var(--admin-border)", color: "var(--admin-text)" }}
                    >
                      Schedule
                    </button>
                    <button
                      onClick={() => showToast(`Editing ${doc.name}`, "info")}
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
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
        >
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                {["Doctor", "Department", "Experience", "Patients", "Appts Today", "Rating", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--admin-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
              {adminDoctors.map((doc) => {
                const s = statusStyles[doc.status];
                return (
                  <tr key={doc.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={doc.image} alt={doc.name} className="w-9 h-9 rounded-xl object-cover" />
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "var(--admin-text)" }}>{doc.name}</p>
                          <p className="text-xs" style={{ color: "var(--admin-muted)" }}>{doc.id} · ₹{doc.fee}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--admin-muted)" }}>{doc.dept}</td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--admin-muted)" }}>{doc.experience} yr</td>
                    <td className="px-5 py-4 text-sm font-medium" style={{ color: "var(--admin-text)" }}>{doc.patients.toLocaleString()}</td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--admin-text)" }}>{doc.appointments}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-sm font-semibold" style={{ color: "var(--admin-text)" }}>{doc.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => showToast(`Viewing ${doc.name}`)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-teal-50 transition-colors">
                          <Eye className="w-3.5 h-3.5 text-teal-600" />
                        </button>
                        <button onClick={() => showToast(`Editing ${doc.name}`, "info")} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors">
                          <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                        </button>
                        <button onClick={() => showToast(`${doc.name} removed`, "error")} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors">
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Shift Schedule */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-base" style={{ color: "var(--admin-text)" }}>Today's Shift Schedule</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--admin-muted)" }}>Current shifts and room assignments</p>
          </div>
          <button className="text-xs font-bold text-teal-600 hover:underline">View Monthly Roster →</button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminDoctors.slice(0, 6).map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border"
              style={{ borderColor: "var(--admin-border)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: "var(--admin-text)" }}>{doc.name.split(' ').pop()}</p>
                  <p className="text-[10px]" style={{ color: "var(--admin-muted)" }}>09:00 AM - 05:00 PM</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">ROOM {Math.floor(Math.random() * 20) + 101}</span>
                <p className="text-[10px] mt-1 text-slate-400">Next: 10:15 AM</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl" style={{ background: "var(--admin-card)" }}>
              <h2 className="font-bold text-lg mb-5" style={{ color: "var(--admin-text)" }}>Add New Doctor</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Full Name", placeholder: "Dr. Full Name", col: 2 },
                  { label: "Specialization", placeholder: "e.g. Cardiologist", col: 1 },
                  { label: "Experience (years)", placeholder: "e.g. 10", col: 1 },
                  { label: "Qualification", placeholder: "MBBS, MD...", col: 2 },
                  { label: "Consultation Fee", placeholder: "₹ Amount", col: 1 },
                  { label: "Phone", placeholder: "+91 XXXXX XXXXX", col: 1 },
                ].map(({ label, placeholder, col }) => (
                  <div key={label} className={col === 2 ? "col-span-2" : ""}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>{label}</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", color: "var(--admin-text)" }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}>Cancel</button>
                <button onClick={() => { setShowModal(false); showToast("Doctor added successfully!", "success"); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}>Add Doctor</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
