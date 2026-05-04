"use client";
import { useState } from "react";
import {
  Download, Filter, TrendingUp, TrendingDown, Users, CalendarDays,
  Stethoscope, BarChart3, FileText, PieChart,
} from "lucide-react";
import { weeklyPatients, deptStats, adminDoctors } from "@/data/admin";
import { useToast } from "@/components/admin/ui/ToastProvider";

type DateRange = "today" | "week" | "month" | "quarter";

// Mini SVG line chart
function LineChart({ data, color = "#0d9488" }: { data: number[]; color?: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 200;
  const H = 60;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - ((v - min) / range) * (H - 8) - 4}`)
    .join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id={`lg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${H} ${points} ${W},${H}`}
        fill={`url(#lg-${color.replace("#","")})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => (
        <circle
          key={i}
          cx={(i / (data.length - 1)) * W}
          cy={H - ((v - min) / range) * (H - 8) - 4}
          r={i === data.length - 1 ? 4 : 2.5}
          fill={color}
        />
      ))}
    </svg>
  );
}

// Donut chart SVG
function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((a, d) => a + d.value, 0);
  const R = 40;
  const CX = 50, CY = 50;
  let cumulative = 0;
  const arcs = data.map((d) => {
    const pct = d.value / total;
    const start = cumulative;
    cumulative += pct;
    const startAngle = start * 2 * Math.PI - Math.PI / 2;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(endAngle);
    const y2 = CY + R * Math.sin(endAngle);
    const largeArc = pct > 0.5 ? 1 : 0;
    return { ...d, d: `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2} Z` };
  });
  return (
    <svg viewBox="0 0 100 100" className="w-24 h-24">
      {arcs.map((arc) => (
        <path key={arc.name} d={arc.d} fill={arc.color} stroke="white" strokeWidth="1" />
      ))}
      <circle cx={CX} cy={CY} r={26} fill="white" />
      <text x={CX} y={CY - 4} textAnchor="middle" fontSize="10" fill="#0f172a" fontWeight="bold">{total}</text>
      <text x={CX} y={CY + 8} textAnchor="middle" fontSize="6" fill="#64748b">patients</text>
    </svg>
  );
}

const metricCards = [
  {
    label: "Patient Growth", value: "+12.4%", sub: "vs last month",
    trend: "up", data: [88, 95, 87, 112, 134, 128, 143, 156, 148, 187, 165, 198],
    color: "#0d9488",
  },
  {
    label: "Appointment Rate", value: "89.2%", sub: "completion rate",
    trend: "up", data: [78, 82, 80, 85, 88, 84, 91, 89, 92, 88, 91, 89],
    color: "#8b5cf6",
  },
  {
    label: "Avg Wait Time", value: "18 min", sub: "-3 min vs last week",
    trend: "down", data: [28, 26, 25, 22, 24, 21, 20, 19, 21, 18, 17, 18],
    color: "#f59e0b",
  },
  {
    label: "Doctor Utilization", value: "76%", sub: "avg across all depts",
    trend: "up", data: [60, 62, 65, 68, 70, 72, 74, 71, 73, 75, 74, 76],
    color: "#0891b2",
  },
];

export default function ReportsPage() {
  const { showToast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange>("week");
  const ranges: { key: DateRange; label: string }[] = [
    { key: "today", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "quarter", label: "Quarter" },
  ];

  const donutData = deptStats.slice(0, 5).map((d) => ({ name: d.name, value: d.patients, color: d.color }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Reports & Analytics</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>Data-driven hospital insights</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Date Range */}
          <div
            className="flex rounded-xl p-1"
            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
          >
            {ranges.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setDateRange(key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: dateRange === key ? "linear-gradient(135deg,#0d9488,#0891b2)" : "transparent",
                  color: dateRange === key ? "white" : "var(--admin-muted)",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => showToast("Generating PDF report...", "info")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border"
            style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button
            onClick={() => showToast("CSV exported successfully!", "success")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Metric Cards with mini charts */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((m) => (
          <div
            key={m.label}
            className="rounded-2xl p-5"
            style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--admin-muted)" }}>{m.label}</p>
                <p className="text-2xl font-bold mt-1" style={{ color: "var(--admin-text)" }}>{m.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {m.trend === "up"
                    ? <TrendingUp className="w-3 h-3 text-green-500" />
                    : <TrendingDown className="w-3 h-3 text-green-500" />
                  }
                  <span className="text-xs text-green-600 font-medium">{m.sub}</span>
                </div>
              </div>
            </div>
            <LineChart data={m.data} color={m.color} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Weekly bar chart */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base" style={{ color: "var(--admin-text)" }}>Weekly Patient Flow</h2>
            <BarChart3 className="w-4 h-4" style={{ color: "var(--admin-muted)" }} />
          </div>
          <div className="flex items-end gap-3 h-36">
            {weeklyPatients.map((d) => {
              const max = 187;
              const h = (d.patients / max) * 100;
              const ha = (d.appointments / max) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold" style={{ color: "#0d9488" }}>{d.patients}</span>
                  <div className="w-full flex items-end gap-0.5" style={{ height: "100px" }}>
                    <div
                      className="flex-1 rounded-t-lg transition-all"
                      style={{ height: `${h}%`, background: "linear-gradient(to top,#0d9488,#0891b2)" }}
                    />
                    <div
                      className="flex-1 rounded-t-lg"
                      style={{ height: `${ha}%`, background: "#cbd5e1" }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: "var(--admin-muted)" }}>{d.day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ background: "linear-gradient(90deg,#0d9488,#0891b2)" }} />
              <span style={{ color: "var(--admin-muted)" }}>Patients</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-300" />
              <span style={{ color: "var(--admin-muted)" }}>Appointments</span>
            </span>
          </div>
        </div>

        {/* Donut chart */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base" style={{ color: "var(--admin-text)" }}>Dept Distribution</h2>
            <PieChart className="w-4 h-4" style={{ color: "var(--admin-muted)" }} />
          </div>
          <div className="flex items-center gap-4">
            <DonutChart data={donutData} />
            <div className="space-y-2">
              {deptStats.slice(0, 5).map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-xs" style={{ color: "var(--admin-muted)" }}>{d.name}</span>
                  <span className="text-xs font-bold ml-auto" style={{ color: "var(--admin-text)" }}>{d.patients}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Performance Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
      >
        <div
          className="px-5 py-4 flex items-center justify-between border-b"
          style={{ borderColor: "var(--admin-border)" }}
        >
          <h2 className="font-bold text-base" style={{ color: "var(--admin-text)" }}>Doctor Performance</h2>
          <FileText className="w-4 h-4" style={{ color: "var(--admin-muted)" }} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                {["Doctor", "Dept", "Appointments", "Patients Treated", "Rating", "Utilization"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--admin-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
              {adminDoctors.map((doc) => {
                const util = Math.round((doc.appointments / 150) * 100);
                return (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={doc.image} alt={doc.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-sm font-medium" style={{ color: "var(--admin-text)" }}>{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--admin-muted)" }}>{doc.dept}</td>
                    <td className="px-5 py-4 text-sm font-bold" style={{ color: "var(--admin-text)" }}>{doc.appointments}</td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--admin-muted)" }}>{doc.patients.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-amber-500">★</span>
                        <span className="text-sm font-bold" style={{ color: "var(--admin-text)" }}>{doc.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full max-w-20" style={{ background: "var(--admin-surface)" }}>
                          <div className="h-2 rounded-full" style={{ width: `${util}%`, background: util > 80 ? "#f59e0b" : "#0d9488" }} />
                        </div>
                        <span className="text-xs font-semibold" style={{ color: "var(--admin-muted)" }}>{util}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
