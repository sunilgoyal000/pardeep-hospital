"use client";
import { useState } from "react";
import { Search, Plus, Filter, Download, MoreHorizontal, Edit2, Trash2, Eye, ChevronUp, ChevronDown } from "lucide-react";
import { patients } from "@/data/admin";
import { useToast } from "@/components/admin/ui/ToastProvider";

type SortKey = "name" | "age" | "lastVisit" | "appointments";
type SortDir = "asc" | "desc";

const statusStyles: Record<string, { bg: string; color: string }> = {
  Active: { bg: "#dcfce7", color: "#16a34a" },
  Inactive: { bg: "#f1f5f9", color: "#64748b" },
  Critical: { bg: "#fee2e2", color: "#dc2626" },
};

export default function PatientsPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [showAddModal, setShowAddModal] = useState(false);

  const statuses = ["All", "Active", "Inactive", "Critical"];

  const filtered = patients
    .filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.doctor.toLowerCase().includes(search.toLowerCase()) ||
        p.dept.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "name") return a.name.localeCompare(b.name) * dir;
      if (sortKey === "age") return (a.age - b.age) * dir;
      if (sortKey === "appointments") return (a.appointments - b.appointments) * dir;
      if (sortKey === "lastVisit") return a.lastVisit.localeCompare(b.lastVisit) * dir;
      return 0;
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Patient Management</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>
            {patients.length.toLocaleString()} total patients
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast("Exporting patient data...", "info")}
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

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active", value: patients.filter((p) => p.status === "Active").length, color: "#22c55e", bg: "#dcfce7" },
          { label: "Inactive", value: patients.filter((p) => p.status === "Inactive").length, color: "#64748b", bg: "#f1f5f9" },
          { label: "Critical", value: patients.filter((p) => p.status === "Critical").length, color: "#ef4444", bg: "#fee2e2" },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg" style={{ background: bg, color }}>
              {value}
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--admin-muted)" }}>{label} Patients</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
      >
        {/* Toolbar */}
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
              placeholder="Search by name, ID, doctor..."
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
              <span className="text-xs font-medium" style={{ color: "var(--admin-muted)" }}>{selected.length} selected</span>
              <button
                onClick={() => { showToast(`${selected.length} patients deleted`, "error"); setSelected([]); }}
                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Table */}
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
                        {label}<SortIcon k={key} />
                      </button>
                    ) : label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
              {filtered.map((p) => {
                const s = statusStyles[p.status] || statusStyles.Inactive;
                const isSelected = selected.includes(p.id);
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
                          style={{ background: `linear-gradient(135deg, ${p.gender === "Female" ? "#db2777,#ec4899" : "#0d9488,#0891b2"})` }}
                        >
                          {p.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "var(--admin-text)" }}>{p.name}</p>
                          <p className="text-xs" style={{ color: "var(--admin-muted)" }}>{p.id} · {p.bloodGroup}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: "var(--admin-muted)" }}>
                      {p.age}y · {p.gender[0]}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className="text-xs font-medium px-2 py-1 rounded-lg"
                        style={{ background: "var(--admin-surface)", color: "var(--admin-text)" }}
                      >
                        {p.dept}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: "var(--admin-muted)" }}>{p.doctor}</td>
                    <td className="px-4 py-3.5 text-sm" style={{ color: "var(--admin-muted)" }}>{p.lastVisit}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold" style={{ color: "var(--admin-text)" }}>{p.appointments}</span>
                      </div>
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
                          onClick={() => showToast(`Editing ${p.name}`, "info")}
                          className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" style={{ color: "#0891b2" }} />
                        </button>
                        <button
                          onClick={() => showToast(`${p.name} removed`, "error")}
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
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div
          className="flex items-center justify-between px-5 py-3 border-t text-xs"
          style={{ borderColor: "var(--admin-border)", color: "var(--admin-muted)" }}
        >
          <span>Showing {filtered.length} of {patients.length} patients</span>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded border" style={{ border: "1px solid var(--admin-border)" }}>← Prev</button>
            <button className="px-2 py-1 rounded bg-teal-500 text-white">1</button>
            <button className="px-2 py-1 rounded border" style={{ border: "1px solid var(--admin-border)" }}>Next →</button>
          </div>
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowAddModal(false)}
          >
            <div
              className="w-full max-w-lg rounded-2xl p-6 shadow-2xl"
              style={{ background: "var(--admin-card)" }}
            >
              <h2 className="font-bold text-lg mb-5" style={{ color: "var(--admin-text)" }}>Add New Patient</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Full Name", placeholder: "Patient full name", col: 2 },
                  { label: "Age", placeholder: "Age", col: 1 },
                  { label: "Gender", placeholder: "Male / Female", col: 1 },
                  { label: "Phone", placeholder: "+91 XXXXX XXXXX", col: 1 },
                  { label: "Blood Group", placeholder: "A+, B-, etc.", col: 1 },
                  { label: "Department", placeholder: "Select department", col: 1 },
                  { label: "Doctor", placeholder: "Assign doctor", col: 1 },
                ].map(({ label, placeholder, col }) => (
                  <div key={label} className={col === 2 ? "col-span-2" : ""}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>
                      {label}
                    </label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{
                        background: "var(--admin-surface)",
                        border: "1px solid var(--admin-border)",
                        color: "var(--admin-text)",
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
                  style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    showToast("New patient added successfully!", "success");
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
                >
                  Add Patient
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
