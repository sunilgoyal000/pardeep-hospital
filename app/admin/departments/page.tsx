"use client";
import { useState } from "react";
import { Plus, Edit2, Trash2, Users, BedDouble, TrendingUp, ChevronRight } from "lucide-react";
import { adminDepartments } from "@/data/admin";
import { useToast } from "@/components/admin/ui/ToastProvider";

const statusStyles: Record<string, { bg: string; color: string }> = {
  Active:   { bg: "#dcfce7", color: "#16a34a" },
  Critical: { bg: "#fee2e2", color: "#dc2626" },
  Inactive: { bg: "#f1f5f9", color: "#64748b" },
};

export default function DepartmentsAdminPage() {
  const { showToast } = useToast();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Department Management</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>{adminDepartments.length} departments configured</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Beds", value: adminDepartments.reduce((a, d) => a + d.beds, 0), color: "#0d9488", bg: "#ccfbf1" },
          { label: "Avg Occupancy", value: `${Math.round(adminDepartments.reduce((a, d) => a + d.occupancy, 0) / adminDepartments.length)}%`, color: "#8b5cf6", bg: "#ede9fe" },
          { label: "Total Doctors", value: adminDepartments.reduce((a, d) => a + d.doctors, 0), color: "#0891b2", bg: "#cffafe" },
          { label: "Critical Depts", value: adminDepartments.filter((d) => d.status === "Critical").length, color: "#dc2626", bg: "#fee2e2" },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0" style={{ background: bg, color }}>{value}</div>
            <p className="text-sm font-medium leading-snug" style={{ color: "var(--admin-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Dept Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminDepartments.map((dept) => {
          const s = statusStyles[dept.status];
          return (
            <div
              key={dept.id}
              className="rounded-2xl overflow-hidden group"
              style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: dept.color }}
                    >
                      {dept.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-base" style={{ color: "var(--admin-text)" }}>{dept.name}</h3>
                      <p className="text-xs mt-0.5" style={{ color: "var(--admin-muted)" }}>{dept.head}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                    {dept.status}
                  </span>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { label: "Doctors", value: dept.doctors, icon: Users },
                    { label: "Beds", value: dept.beds, icon: BedDouble },
                    { label: "Occupancy", value: `${dept.occupancy}%`, icon: TrendingUp },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-xl p-2.5 text-center" style={{ background: "var(--admin-surface)" }}>
                      <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: "#0d9488" }} />
                      <p className="text-sm font-bold" style={{ color: "var(--admin-text)" }}>{value}</p>
                      <p className="text-xs" style={{ color: "var(--admin-muted)" }}>{label}</p>
                    </div>
                  ))}
                </div>

                {/* Occupancy bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1" style={{ color: "var(--admin-muted)" }}>
                    <span>Bed Occupancy</span>
                    <span style={{ color: dept.occupancy > 80 ? "#dc2626" : "#0d9488" }}>{dept.occupancy}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "var(--admin-surface)" }}>
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{
                        width: `${dept.occupancy}%`,
                        background: dept.occupancy > 80
                          ? "linear-gradient(90deg,#f59e0b,#ef4444)"
                          : "linear-gradient(90deg,#0d9488,#0891b2)",
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => showToast(`Editing ${dept.name}`, "info")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border"
                    style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => showToast(`${dept.name} details`, "info")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white"
                    style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}
                  >
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Dept Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: "var(--admin-card)" }}>
              <h2 className="font-bold text-lg mb-5" style={{ color: "var(--admin-text)" }}>Add New Department</h2>
              <div className="space-y-4">
                {[
                  { label: "Department Name", placeholder: "e.g. Dermatology" },
                  { label: "Department Head (Doctor)", placeholder: "Assign doctor" },
                  { label: "Number of Beds", placeholder: "e.g. 20" },
                  { label: "Floor / Location", placeholder: "e.g. 2nd Floor, Block B" },
                ].map(({ label, placeholder }) => (
                  <div key={label}>
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
                <button onClick={() => { setShowModal(false); showToast("Department added!", "success"); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}>Add Department</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
