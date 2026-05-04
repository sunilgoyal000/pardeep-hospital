"use client";
import { useState } from "react";
import { Plus, Edit2, Users, BedDouble, ChevronRight } from "lucide-react";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { DepartmentView } from "@/modules/departments/schema";

interface Props {
  initialDepartments: DepartmentView[];
}

export default function DepartmentsClient({ initialDepartments }: Props) {
  const { showToast } = useToast();
  const [departments] = useState(initialDepartments);
  const [showModal, setShowModal] = useState(false);

  const totalBeds = departments.reduce((a, d) => a + (d.beds ?? 0), 0);
  const totalDoctors = departments.reduce((a, d) => a + d.doctorsCount, 0);
  const withBeds = departments.filter((d) => d.beds != null).length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Department Management</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>
            {departments.length} departments configured
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}
        >
          <Plus className="w-4 h-4" /> Add Department
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Total Beds",     value: totalBeds,     color: "#0d9488", bg: "#ccfbf1" },
          { label: "Total Doctors",  value: totalDoctors,  color: "#0891b2", bg: "#cffafe" },
          { label: "With Bed Data",  value: `${withBeds}/${departments.length}`, color: "#8b5cf6", bg: "#ede9fe" },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base flex-shrink-0" style={{ background: bg, color }}>
              {value}
            </div>
            <p className="text-sm font-medium leading-snug" style={{ color: "var(--admin-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
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
                    style={{ background: dept.colorHex ?? "#f1f5f9" }}
                  >
                    {dept.iconEmoji ?? "🏥"}
                  </div>
                  <div>
                    <h3 className="font-bold text-base" style={{ color: "var(--admin-text)" }}>{dept.name}</h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--admin-muted)" }}>
                      {dept.headDoctorName ? `Head: ${dept.headDoctorName}` : "No head assigned"}
                    </p>
                  </div>
                </div>
                <span
                  className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--admin-surface)", color: "var(--admin-muted)" }}
                >
                  {dept.code}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="rounded-xl p-2.5 text-center" style={{ background: "var(--admin-surface)" }}>
                  <Users className="w-4 h-4 mx-auto mb-1" style={{ color: "#0d9488" }} />
                  <p className="text-sm font-bold" style={{ color: "var(--admin-text)" }}>{dept.doctorsCount}</p>
                  <p className="text-xs" style={{ color: "var(--admin-muted)" }}>Doctors</p>
                </div>
                <div className="rounded-xl p-2.5 text-center" style={{ background: "var(--admin-surface)" }}>
                  <BedDouble className="w-4 h-4 mx-auto mb-1" style={{ color: "#0d9488" }} />
                  <p className="text-sm font-bold" style={{ color: "var(--admin-text)" }}>
                    {dept.beds ?? "—"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--admin-muted)" }}>Beds</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => showToast(`Edit form lands in a follow-up PR`, "info")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold border"
                  style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => showToast(`${dept.name} details view lands in a follow-up PR`, "info")}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white"
                  style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}
                >
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {departments.length === 0 && (
          <div className="col-span-full py-10 text-center text-sm" style={{ color: "var(--admin-muted)" }}>
            No departments configured yet.
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: "var(--admin-card)" }}>
              <h2 className="font-bold text-lg mb-3" style={{ color: "var(--admin-text)" }}>Add New Department</h2>
              <p className="text-xs" style={{ color: "var(--admin-muted)" }}>
                Department CRUD lands in a follow-up PR. Until then you can run
                {" "}<code>npm run db:seed</code>{" "} or insert directly via Prisma Studio.
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
