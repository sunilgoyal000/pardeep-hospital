"use client";
import { useState, useEffect } from "react";
import {
  Users, Activity, CalendarDays, TrendingUp, TrendingDown,
  ArrowUpRight, MoreHorizontal, Circle,
} from "lucide-react";
import { kpiData, weeklyPatients, deptStats, recentActivity, appointments } from "@/data/admin";

function KPICard({
  label, value, growth, icon: Icon, iconBg, iconColor, prefix = "", suffix = "",
}: {
  label: string; value: number; growth: number; icon: React.ElementType;
  iconBg: string; iconColor: string; prefix?: string; suffix?: string;
}) {
  const positive = growth >= 0;
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: "var(--admin-card)",
        border: "1px solid var(--admin-border)",
        boxShadow: "0 1px 4px rgb(0 0 0 / 0.05)",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        <button className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
          <MoreHorizontal className="w-4 h-4" style={{ color: "var(--admin-muted)" }} />
        </button>
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: "var(--admin-text)" }}>
          {prefix}{typeof value === "number" && value >= 1000
            ? value.toLocaleString("en-IN")
            : value}{suffix}
        </p>
        <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>{label}</p>
      </div>
      <div className="flex items-center gap-1.5">
        <div
          className="flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: positive ? "#dcfce7" : "#fee2e2",
            color: positive ? "#16a34a" : "#dc2626",
          }}
        >
          {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {Math.abs(growth)}%
        </div>
        <span className="text-xs" style={{ color: "var(--admin-muted)" }}>vs last week</span>
      </div>
    </div>
  );
}

// SVG Bar Chart
function BarChart() {
  const max = Math.max(...weeklyPatients.map((d) => d.patients));
  const H = 120;
  const BAR_W = 28;
  const GAP = 14;
  const W = weeklyPatients.length * (BAR_W + GAP) - GAP;

  return (
    <div className="overflow-x-auto">
      <svg width={W + 16} height={H + 40} className="mx-auto">
        {weeklyPatients.map((d, i) => {
          const barH = (d.patients / max) * H;
          const x = i * (BAR_W + GAP);
          return (
            <g key={d.day}>
              {/* Background bar */}
              <rect x={x} y={0} width={BAR_W} height={H} rx={6} fill="#f1f5f9" />
              {/* Value bar */}
              <rect
                x={x}
                y={H - barH}
                width={BAR_W}
                height={barH}
                rx={6}
                fill="url(#barGrad)"
              />
              {/* Appointment overlay */}
              <rect
                x={x + 6}
                y={H - (d.appointments / max) * H}
                width={BAR_W - 12}
                height={(d.appointments / max) * H}
                rx={4}
                fill="rgba(8,145,178,0.3)"
              />
              {/* Day label */}
              <text
                x={x + BAR_W / 2}
                y={H + 18}
                textAnchor="middle"
                fontSize="11"
                fill="#94a3b8"
                fontFamily="Inter, sans-serif"
                fontWeight="500"
              >
                {d.day}
              </text>
              {/* Value label */}
              <text
                x={x + BAR_W / 2}
                y={H - barH - 5}
                textAnchor="middle"
                fontSize="10"
                fill="#0d9488"
                fontFamily="Inter, sans-serif"
                fontWeight="600"
              >
                {d.patients}
              </text>
            </g>
          );
        })}
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Horizontal bar chart for departments
function DeptBar({ name, patients, color, pct }: { name: string; patients: number; color: string; pct: number }) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs font-medium w-24 flex-shrink-0" style={{ color: "var(--admin-text)" }}>{name}</p>
      <div className="flex-1 h-2 rounded-full" style={{ background: "var(--admin-surface)" }}>
        <div
          className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-semibold w-8 text-right flex-shrink-0" style={{ color: "var(--admin-muted)" }}>
        {patients}
      </span>
    </div>
  );
}

const activityColors: Record<string, string> = {
  new: "#0891b2", active: "#22c55e", done: "#94a3b8",
  cancelled: "#ef4444", warning: "#f59e0b",
};
const activityIcons: Record<string, string> = {
  appointment: "📅", queue: "🔢", patient: "🧑", doctor: "👨‍⚕️", system: "⚙️",
};

export default function AdminDashboard() {
  const [liveKpi, setLiveKpi] = useState(kpiData);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveKpi(prev => ({
        ...prev,
        activeQueues: prev.activeQueues + (Math.random() > 0.7 ? 1 : Math.random() > 0.4 ? 0 : -1),
        appointmentsToday: prev.appointmentsToday + (Math.random() > 0.8 ? 1 : 0),
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Dashboard Overview</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>
            Thursday, 24 April 2026 — Live hospital operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg"
            style={{ background: "#dcfce7", color: "#16a34a" }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            All systems live
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total Patients" value={liveKpi.totalPatients} growth={liveKpi.patientGrowth}
          icon={Users} iconBg="#ccfbf1" iconColor="#0d9488"
        />
        <KPICard
          label="Active Queues" value={liveKpi.activeQueues} growth={liveKpi.queueGrowth}
          icon={Activity} iconBg="#cffafe" iconColor="#0891b2"
        />
        <KPICard
          label="Appointments Today" value={liveKpi.appointmentsToday} growth={liveKpi.appointmentGrowth}
          icon={CalendarDays} iconBg="#ede9fe" iconColor="#8b5cf6"
        />
        <KPICard
          label="Revenue Today" value={liveKpi.revenueToday} growth={liveKpi.revenueGrowth}
          icon={TrendingUp} iconBg="#fef3c7" iconColor="#d97706" prefix="₹"
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Weekly trend */}
        <div
          className="lg:col-span-2 rounded-2xl p-5"
          style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-base" style={{ color: "var(--admin-text)" }}>Weekly Patient Trend</h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--admin-muted)" }}>Patients vs Appointments this week</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded" style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }} />
                <span style={{ color: "var(--admin-muted)" }}>Patients</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded" style={{ background: "rgba(8,145,178,0.3)" }} />
                <span style={{ color: "var(--admin-muted)" }}>Appts</span>
              </span>
            </div>
          </div>
          <BarChart />
        </div>

        {/* Department breakdown */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base" style={{ color: "var(--admin-text)" }}>By Department</h2>
            <span className="text-xs font-medium" style={{ color: "#0d9488" }}>This week</span>
          </div>
          <div className="space-y-4">
            {deptStats.map((d) => (
              <DeptBar key={d.name} {...d} />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--admin-border)" }}>
            <p className="text-xs text-center" style={{ color: "var(--admin-muted)" }}>
              Total: <strong style={{ color: "var(--admin-text)" }}>977</strong> patients this week
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div
          className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between border-b"
            style={{ borderColor: "var(--admin-border)" }}
          >
            <h2 className="font-bold text-base" style={{ color: "var(--admin-text)" }}>Recent Activity</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs" style={{ color: "var(--admin-muted)" }}>Live</span>
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-start gap-3 px-5 py-3.5">
                <span className="text-base flex-shrink-0">{activityIcons[a.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm" style={{ color: "var(--admin-text)" }}>{a.msg}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--admin-muted)" }}>{a.time}</p>
                </div>
                <div
                  className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                  style={{ background: activityColors[a.status] || "#94a3b8" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Today's appointments snapshot */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
        >
          <div
            className="px-5 py-4 border-b"
            style={{ borderColor: "var(--admin-border)" }}
          >
            <h2 className="font-bold text-base" style={{ color: "var(--admin-text)" }}>Today's Appointments</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--admin-muted)" }}>April 24, 2026</p>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
            {appointments.slice(0, 5).map((apt) => {
              const statusColors: Record<string, { bg: string; color: string }> = {
                Confirmed: { bg: "#dcfce7", color: "#16a34a" },
                Completed: { bg: "#f1f5f9", color: "#64748b" },
                Cancelled: { bg: "#fee2e2", color: "#dc2626" },
                Pending: { bg: "#fef3c7", color: "#d97706" },
              };
              const s = statusColors[apt.status] || statusColors.Pending;
              return (
                <div key={apt.id} className="px-5 py-3">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: "var(--admin-text)" }}>{apt.patient}</p>
                      <p className="text-xs" style={{ color: "var(--admin-muted)" }}>{apt.doctor} · {apt.time}</p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: s.bg, color: s.color }}
                    >
                      {apt.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-5 py-3 border-t" style={{ borderColor: "var(--admin-border)" }}>
            <a href="/admin/appointments" className="text-xs font-semibold" style={{ color: "#0d9488" }}>
              View all appointments →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
