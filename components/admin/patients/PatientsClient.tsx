"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Plus, Download, Edit2, Trash2, Eye, ChevronUp, ChevronDown,
} from "lucide-react";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { PatientView } from "@/modules/patients/schema";
import EditPatientModal from "./EditPatientModal";

type SortKey = "name" | "age" | "lastVisit" | "appointments";
type SortDir = "asc" | "desc";
type StatusFilter = "All" | "Active" | "Inactive";

const statusStyles: Record<string, { bg: string; color: string }> = {
  Active:   { bg: "#dcfce7", color: "#16a34a" },
  Inactive: { bg: "#f1f5f9", color: "#64748b" },
};

interface Props {
  initialPatients: PatientView[];
}

export default function PatientsClient({ initialPatients }: Props) {
  const { showToast } = useToast();
  const router = useRouter();
  const [patients] = useState<PatientView[]>(initialPatients);
  const [editing, setEditing] = useState<PatientView | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showAddModal, setShowAddModal] = useState(false);

  const statuses: StatusFilter[] = ["All", "Active", "Inactive"];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return patients
      .filter((p) => {
        const matchSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.lastVisitDoctor ?? "").toLowerCase().includes(q) ||
          (p.lastVisitDept ?? "").toLowerCase().includes(q);
        const matchStatus = statusFilter === "All" || p.status === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
        if (sortKey === "age") return ((a.age ?? -1) - (b.age ?? -1)) * dir;
        if (sortKey === "appointments") return (a.appointmentCount - b.appointmentCount) * dir;
        if (sortKey === "lastVisit") {
          return ((a.lastVisit ?? "") > (b.lastVisit ?? "") ? 1 : -1) * dir;
        }
        return 0;
      });
  }, [patients, search, statusFilter, sortKey, sortDir]);

  const counts = useMemo(
    () => ({
      Active: patients.filter((p) => p.status === "Active").length,
      Inactive: patients.filter((p) => p.status === "Inactive").length,
    }),
    [patients]
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  const toggleAll = () => {
    setSelected(selected.length === filtered.length ? [] : filtered.map((p) => p.id));
  };

  const SortIcon = ({ k }: { k: SortKey }) => (
    <span className="ml-1 inline-flex flex-col">
      <ChevronUp className="w-3 h-3 -mb-0.5" style={{ color: sortKey === k && sortDir === "asc" ? "#0d9488" : "#cbd5e1" }} />
      <ChevronDown className="w-3 h-3" style={{ color: sortKey === k && sortDir === "desc" ? "#0d9488" : "#cbd5e1" }} />
    </span>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Patient Management</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>
            {patients.length.toLocaleString()} total patients
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast("Export coming in a follow-up PR", "info")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors hover:bg-gray-50"
            style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}
          >
            <Download className="w-4 h-4" /> Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
          >
            <Plus className="w-4 h-4" /> Add Patient
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(["Active", "Inactive"] as const).map((label) => {
          const palette = statusStyles[label];
          return (
            <div
              key={label}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg"
                style={{ background: palette.bg, color: palette.color }}
              >
                {counts[label]}
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--admin-muted)" }}>
                {label} Patients
              </p>
            </div>
          );
        })}
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
      >
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: "var(--admin-border)" }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 max-w-sm"
            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
          >
            <Search className="w-4 h-4 flex-shrink-0" style={{ color: "var(--admin-muted)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, doctor, dept..."
              className="bg-transparent outline-none text-sm flex-1"
              style={{ color: "var(--admin-text)" }}
            />
          </div>

          <div className="flex items-center gap-2">
            {statuses.map((s) => (
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

          {selected.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-medium" style={{ color: "var(--admin-muted)" }}>
                {selected.length} selected
              </span>
              <button
                onClick={() => {
                  showToast("Bulk delete will land with patient delete API", "info");
                  setSelected([]);
                }}
                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded"
                  />
                </th>
                {[
                  { key: "name" as SortKey, label: "Patient" },
                  { key: "age" as SortKey, label: "Age" },
                  { key: null, label: "Department" },
                  { key: null, label: "Doctor" },
                  { key: "lastVisit" as SortKey, label: "Last Visit" },
                  { key: "appointments" as SortKey, label: "Visits" },
                  { key: null, label: "Status" },
                  { key: null, label: "" },
                ].map(({ key, label }, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--admin-muted)" }}
                  >
                    {key ? (
                      <button
                        onClick={() => toggleSort(key)}
                        className="flex items-center hover:text-teal-600 transition-colors"
                      >
                        {label}
                        <SortIcon k={key} />
                      </button>
                    ) : label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
              {filtered.map((p) => {
                const s = statusStyles[p.status];
                const isSelected = selected.includes(p.id);
                const female = p.gender === "FEMALE";
                return (
                  <tr
                    key={p.id}
                    className="group transition-colors"
                    style={{ background: isSelected ? "#f0fdfa" : "transparent" }}
                  >
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(p.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${female ? "#db2777,#ec4899" : "#0d9488,#0891b2"})`,
                          }}
                        >
                          {p.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "var(--admin-text)" }}>{p.name}</p>
                          <p className="text-xs" style={{ color: "var(--admin-muted)" }}>
                            {p.id.slice(-8)}
                            {p.bloodGroup ? ` · ${p.bloodGroup}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: "var(--admin-muted)" }}>
                      {p.age != null ? `${p.age}y` : "—"}
                      {p.gender ? ` · ${p.gender[0]}` : ""}
                    </td>
                    <td className="px-4 py-3.5">
                      {p.lastVisitDept ? (
                        <span
                          className="text-xs font-medium px-2 py-1 rounded-lg"
                          style={{ background: "var(--admin-surface)", color: "var(--admin-text)" }}
                        >
                          {p.lastVisitDept}
                        </span>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--admin-muted)" }}>—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: "var(--admin-muted)" }}>
                      {p.lastVisitDoctor ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: "var(--admin-muted)" }}>
                      {p.lastVisit ?? "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold" style={{ color: "var(--admin-text)" }}>
                        {p.appointmentCount}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: s.bg, color: s.color }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => showToast(`Viewing ${p.name}'s profile`)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-teal-50 transition-colors"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5" style={{ color: "#0d9488" }} />
                        </button>
                        <button
                          onClick={() => setEditing(p)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
                          title="Edit profile"
                        >
                          <Edit2 className="w-3.5 h-3.5" style={{ color: "#0891b2" }} />
                        </button>
                        <button
                          onClick={() => showToast(`Delete API lands in a follow-up PR`, "info")}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-10 text-center text-sm" style={{ color: "var(--admin-muted)" }}>
                    No patients match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div
          className="flex items-center justify-between px-5 py-3 border-t text-xs"
          style={{ borderColor: "var(--admin-border)", color: "var(--admin-muted)" }}
        >
          <span>Showing {filtered.length} of {patients.length} patients</span>
        </div>
      </div>

      <EditPatientModal
        patient={editing}
        onClose={() => setEditing(null)}
        onSuccess={() => router.refresh()}
      />

      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl" style={{ background: "var(--admin-card)" }}>
              <h2 className="font-bold text-lg mb-3" style={{ color: "var(--admin-text)" }}>
                Add New Patient
              </h2>
              <p className="text-xs" style={{ color: "var(--admin-muted)" }}>
                Patient creation requires a user-creation flow (account + profile). Lands in a dedicated PR
                alongside the user-management page so we get auth, password setup, and audit on one path.
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
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
