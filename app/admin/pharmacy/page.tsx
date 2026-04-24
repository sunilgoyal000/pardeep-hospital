"use client";
import { useState } from "react";
import { Search, CheckCircle, Clock, Pill, AlertCircle, Eye, ChevronRight } from "lucide-react";
import { prescriptions, liveQueues } from "@/data/admin";
import { useToast } from "@/components/admin/ui/ToastProvider";

const statusStyles: Record<string, { bg: string; color: string; dot: string }> = {
  Dispensed: { bg: "#dcfce7", color: "#16a34a", dot: "#22c55e" },
  Pending:   { bg: "#fef3c7", color: "#d97706", dot: "#f59e0b" },
  Cancelled: { bg: "#fee2e2", color: "#dc2626", dot: "#ef4444" },
};

// Mock inventory
const inventory = [
  { name: "Amlodipine 5mg", stock: 240, min: 50, unit: "Tablets" },
  { name: "Atorvastatin 20mg", stock: 180, min: 50, unit: "Tablets" },
  { name: "Metformin 500mg", stock: 12, min: 100, unit: "Tablets" },
  { name: "Azithromycin 500mg", stock: 88, min: 30, unit: "Capsules" },
  { name: "Paracetamol 500mg", stock: 430, min: 100, unit: "Tablets" },
  { name: "Omeprazole 20mg", stock: 25, min: 50, unit: "Capsules" },
];

export default function PharmacyPage() {
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const pharmacyQueue = liveQueues.find((q) => q.dept === "Pharmacy");

  const [selectedRx, setSelectedRx] = useState<any>(null);

  const filtered = prescriptions.filter((p) => {
    const matchSearch =
      p.patient.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.doctor.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || p.status === filter;
    return matchSearch && matchFilter;
  });

  const handleDispense = (rx: any) => {
    setSelectedRx(rx);
  };

  const confirmDispense = () => {
    showToast(`${selectedRx.id} successfully dispensed and billed.`, "success");
    setSelectedRx(null);
  };

  return (
    <div className="space-y-5">
      {/* ... previous content ... */}
      
      {/* Dispense Modal */}
      {selectedRx && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setSelectedRx(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl" style={{ background: "var(--admin-card)" }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-lg" style={{ color: "var(--admin-text)" }}>Dispense Prescription</h2>
                  <p className="text-xs text-teal-600 font-mono mt-0.5">{selectedRx.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold" style={{ color: "var(--admin-muted)" }}>Patient</p>
                  <p className="text-sm font-bold" style={{ color: "var(--admin-text)" }}>{selectedRx.patient}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 rounded-xl bg-slate-50 border" style={{ borderColor: "var(--admin-border)" }}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-400">Medicines to Dispense</p>
                  <div className="space-y-3">
                    {selectedRx.medicines.map((m: string, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-teal-500" />
                          <span className="text-sm font-medium" style={{ color: "var(--admin-text)" }}>{m}</span>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-white border">1 Unit</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-teal-200 bg-teal-50/50">
                  <div>
                    <p className="text-xs font-bold text-teal-800">Total Billing Amount</p>
                    <p className="text-lg font-black text-teal-900">₹ {(selectedRx.medicines.length * 145 + 50).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-teal-600 font-bold uppercase">Payment Status</p>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-600 text-white">PAID</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedRx(null)}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border"
                  style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDispense}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
                  style={{ background: "linear-gradient(135deg, #22c55e, #16a34a)" }}
                >
                  Confirm & Print Label
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Pharmacy Module</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>Prescription tracking & inventory</p>
        </div>
      </div>

      {/* Stats + Pharmacy Queue */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-3 gap-4">
          {[
            { label: "Total Prescriptions", value: prescriptions.length, color: "#0d9488", bg: "#ccfbf1" },
            { label: "Pending Dispense", value: prescriptions.filter((p) => p.status === "Pending").length, color: "#d97706", bg: "#fef3c7" },
            { label: "Dispensed Today", value: prescriptions.filter((p) => p.status === "Dispensed").length, color: "#22c55e", bg: "#dcfce7" },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className="rounded-2xl p-4 flex flex-col gap-2"
              style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg" style={{ background: bg, color }}>{value}</div>
              <p className="text-xs font-medium" style={{ color: "var(--admin-muted)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Live pharmacy queue */}
        {pharmacyQueue && (
          <div
            className="rounded-2xl p-4"
            style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm" style={{ color: "var(--admin-text)" }}>Pharmacy Queue</h3>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-600">Live</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: "#22c55e" }}>{pharmacyQueue.current}</p>
                <p className="text-xs" style={{ color: "var(--admin-muted)" }}>Served</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: "#d97706" }}>{pharmacyQueue.waiting}</p>
                <p className="text-xs" style={{ color: "var(--admin-muted)" }}>Waiting</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: "#0d9488" }}>{pharmacyQueue.avgWait}m</p>
                <p className="text-xs" style={{ color: "var(--admin-muted)" }}>Avg Wait</p>
              </div>
            </div>
            <button
              onClick={() => showToast("Next pharmacy token called", "success")}
              className="w-full py-2 rounded-xl text-xs font-semibold text-white"
              style={{ background: "#22c55e" }}
            >
              Call Next RX Token
            </button>
          </div>
        )}
      </div>

      {/* Prescriptions Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
      >
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-5 py-4 border-b"
          style={{ borderColor: "var(--admin-border)" }}
        >
          <h2 className="font-bold text-base flex-shrink-0" style={{ color: "var(--admin-text)" }}>Prescriptions</h2>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 max-w-xs"
            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
          >
            <Search className="w-4 h-4" style={{ color: "var(--admin-muted)" }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prescriptions..."
              className="bg-transparent outline-none text-sm flex-1"
              style={{ color: "var(--admin-text)" }}
            />
          </div>
          <div className="flex gap-1.5">
            {["All", "Pending", "Dispensed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: filter === f ? "linear-gradient(135deg,#0d9488,#0891b2)" : "var(--admin-surface)",
                  color: filter === f ? "white" : "var(--admin-muted)",
                  border: "1px solid var(--admin-border)",
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
          {filtered.map((rx) => {
            const s = statusStyles[rx.status];
            return (
              <div key={rx.id} className="px-5 py-4 flex items-start gap-4 group hover:bg-slate-50 transition-colors">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "#ccfbf1" }}
                >
                  <Pill className="w-4 h-4 text-teal-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold" style={{ color: "#0d9488" }}>{rx.id}</span>
                    <span className="text-xs" style={{ color: "var(--admin-muted)" }}>•</span>
                    <span className="text-xs" style={{ color: "var(--admin-muted)" }}>{rx.date}</span>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "var(--admin-text)" }}>{rx.patient}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--admin-muted)" }}>Prescribed by {rx.doctor}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {rx.medicines.map((m) => (
                      <span
                        key={m}
                        className="text-xs px-2 py-0.5 rounded-lg font-medium"
                        style={{ background: "var(--admin-surface)", color: "var(--admin-text)" }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: s.dot }} />
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                      {rx.status}
                    </span>
                  </div>
                  {rx.status === "Pending" && (
                    <button
                      onClick={() => handleDispense(rx)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl text-white transition-transform active:scale-95"
                      style={{ background: "#22c55e" }}
                    >
                      Dispense ✓
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inventory */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between border-b"
          style={{ borderColor: "var(--admin-border)" }}
        >
          <h2 className="font-bold text-base" style={{ color: "var(--admin-text)" }}>Medicine Inventory</h2>
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: "#fee2e2", color: "#dc2626" }}
          >
            {inventory.filter((i) => i.stock < i.min).length} low stock
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
          {inventory.map((item) => {
            const isLow = item.stock < item.min;
            const pct = Math.min(100, Math.round((item.stock / (item.min * 4)) * 100));
            return (
              <div key={item.name} className="px-5 py-3.5 flex items-center gap-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: isLow ? "#fee2e2" : "#ccfbf1" }}
                >
                  {isLow
                    ? <AlertCircle className="w-4 h-4 text-red-500" />
                    : <CheckCircle className="w-4 h-4 text-teal-600" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium" style={{ color: "var(--admin-text)" }}>{item.name}</p>
                    <span
                      className="text-xs font-bold"
                      style={{ color: isLow ? "#dc2626" : "#16a34a" }}
                    >
                      {item.stock} {item.unit}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: "var(--admin-surface)" }}>
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: isLow ? "#ef4444" : "linear-gradient(90deg,#0d9488,#0891b2)",
                      }}
                    />
                  </div>
                </div>
                {isLow && (
                  <button
                    onClick={() => showToast(`Reorder request sent for ${item.name}`, "warning")}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg flex-shrink-0"
                    style={{ background: "#fee2e2", color: "#dc2626" }}
                  >
                    Reorder
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
