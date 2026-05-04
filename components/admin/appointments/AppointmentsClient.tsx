"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Search, Calendar, List, ChevronLeft, ChevronRight,
  Edit2, Trash2, Eye, Clock,
} from "lucide-react";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { AppointmentView } from "@/modules/appointments/schema";
import BookAppointmentModal from "./BookAppointmentModal";

type ViewMode = "list" | "calendar";
type StatusFilter = "All" | "Pending" | "Confirmed" | "Completed" | "Cancelled";

const statusStyles: Record<string, { bg: string; color: string; dot: string }> = {
  Confirmed: { bg: "#dcfce7", color: "#16a34a", dot: "#22c55e" },
  Completed: { bg: "#f1f5f9", color: "#64748b", dot: "#94a3b8" },
  Cancelled: { bg: "#fee2e2", color: "#dc2626", dot: "#ef4444" },
  Pending:   { bg: "#fef3c7", color: "#d97706", dot: "#f59e0b" },
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function getCalendarDays(year: number, month: number) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  return { first, days };
}

interface Props {
  initialAppointments: AppointmentView[];
}

export default function AppointmentsClient({ initialAppointments }: Props) {
  const { showToast } = useToast();
  const router = useRouter();

  const [appointments] = useState<AppointmentView[]>(initialAppointments);
  const [view, setView] = useState<ViewMode>("list");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  const statuses: StatusFilter[] = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

  const filtered = appointments.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch =
      a.patient.toLowerCase().includes(q) ||
      a.doctor.toLowerCase().includes(q) ||
      a.dept.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const { first, days } = getCalendarDays(calYear, calMonth);
  const apptDays = new Set(
    appointments
      .filter((a) => {
        const d = new Date(a.date);
        return d.getFullYear() === calYear && d.getMonth() === calMonth;
      })
      .map((a) => parseInt(a.date.split("-")[2]))
  );

  async function cancel(id: string) {
    const res = await fetch(`/api/appointments/${id}`, { method: "DELETE" });
    if (!res.ok) {
      showToast("Failed to cancel appointment", "error");
      return;
    }
    showToast(`Appointment ${id} cancelled`, "error");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Appointment System</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>
            {appointments.length} appointments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex rounded-xl p-1"
            style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
          >
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: view === "list" ? "linear-gradient(135deg,#0d9488,#0891b2)" : "transparent",
                color: view === "list" ? "white" : "var(--admin-muted)",
              }}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setView("calendar")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: view === "calendar" ? "linear-gradient(135deg,#0d9488,#0891b2)" : "transparent",
                color: view === "calendar" ? "white" : "var(--admin-muted)",
              }}
            >
              <Calendar className="w-3.5 h-3.5" /> Calendar
            </button>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}
          >
            <Plus className="w-4 h-4" /> Book Appointment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(["Pending","Confirmed","Completed","Cancelled"] as const).map((s) => {
          const count = appointments.filter((a) => a.status === s).length;
          const st = statusStyles[s];
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(statusFilter === s ? "All" : s)}
              className="rounded-2xl p-4 flex items-center gap-3 transition-all hover:-translate-y-0.5 text-left"
              style={{
                background: statusFilter === s ? st.bg : "var(--admin-card)",
                border: `1px solid ${statusFilter === s ? st.dot + "44" : "var(--admin-border)"}`,
                boxShadow: statusFilter === s ? `0 4px 16px ${st.dot}22` : "none",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base"
                style={{ background: st.bg, color: st.color }}
              >
                {count}
              </div>
              <p className="text-sm font-medium" style={{ color: st.color }}>{s}</p>
            </button>
          );
        })}
      </div>

      {view === "calendar" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
        >
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "var(--admin-border)" }}
          >
            <button
              onClick={() => {
                if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); }
                else setCalMonth(calMonth - 1);
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" style={{ color: "var(--admin-muted)" }} />
            </button>
            <h2 className="font-bold text-base" style={{ color: "var(--admin-text)" }}>
              {MONTHS[calMonth]} {calYear}
            </h2>
            <button
              onClick={() => {
                if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); }
                else setCalMonth(calMonth + 1);
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="w-4 h-4" style={{ color: "var(--admin-muted)" }} />
            </button>
          </div>
          <div className="grid grid-cols-7 border-b" style={{ borderColor: "var(--admin-border)" }}>
            {DAYS.map((d) => (
              <div key={d} className="py-2 text-center text-xs font-semibold" style={{ color: "var(--admin-muted)" }}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: first }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 border-r border-b" style={{ borderColor: "var(--admin-border)" }} />
            ))}
            {Array.from({ length: days }, (_, i) => i + 1).map((day) => {
              const hasAppt = apptDays.has(day);
              const isToday =
                day === today.getDate() &&
                calMonth === today.getMonth() &&
                calYear === today.getFullYear();
              return (
                <div
                  key={day}
                  className="h-16 p-1 border-r border-b flex flex-col items-start cursor-pointer hover:bg-teal-50 transition-colors"
                  style={{ borderColor: "var(--admin-border)" }}
                >
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: isToday ? "linear-gradient(135deg,#0d9488,#0891b2)" : "transparent",
                      color: isToday ? "white" : "var(--admin-text)",
                    }}
                  >
                    {day}
                  </span>
                  {hasAppt && (
                    <span
                      className="mt-1 text-xs px-1.5 py-0.5 rounded font-medium"
                      style={{ background: "#ccfbf1", color: "#0f766e" }}
                    >
                      {appointments.filter((a) => parseInt(a.date.split("-")[2]) === day).length} appts
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "list" && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
        >
          <div
            className="flex items-center gap-3 px-5 py-4 border-b"
            style={{ borderColor: "var(--admin-border)" }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 max-w-sm"
              style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)" }}
            >
              <Search className="w-4 h-4" style={{ color: "var(--admin-muted)" }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient, doctor, dept..."
                className="bg-transparent outline-none text-sm flex-1"
                style={{ color: "var(--admin-text)" }}
              />
            </div>
            <div className="flex gap-1.5">
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                  {["Appointment ID", "Patient", "Doctor", "Dept", "Date & Time", "Token", "Status", "Actions"].map((h) => (
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
                {filtered.map((apt) => {
                  const s = statusStyles[apt.status] || statusStyles.Pending;
                  return (
                    <tr key={apt.id} className="group hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono font-semibold" style={{ color: "#0d9488" }}>{apt.id.slice(-8)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}
                          >
                            {apt.patient[0]}
                          </div>
                          <span className="text-sm font-medium" style={{ color: "var(--admin-text)" }}>{apt.patient}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: "var(--admin-muted)" }}>{apt.doctor}</td>
                      <td className="px-5 py-4">
                        <span
                          className="text-xs px-2 py-1 rounded-lg font-medium"
                          style={{ background: "var(--admin-surface)", color: "var(--admin-text)" }}
                        >
                          {apt.dept}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm" style={{ color: "var(--admin-text)" }}>{apt.date}</p>
                        <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--admin-muted)" }}>
                          <Clock className="w-3 h-3" /> {apt.time}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="text-xs font-mono font-bold px-2 py-1 rounded-lg"
                          style={{ background: "#ccfbf1", color: "#0f766e" }}
                        >
                          {apt.token}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.dot }} />
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: s.bg, color: s.color }}
                          >
                            {apt.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => showToast(`Viewing appointment ${apt.id.slice(-8)}`)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-teal-50">
                            <Eye className="w-3.5 h-3.5 text-teal-600" />
                          </button>
                          <button onClick={() => showToast(`Editing appointment ${apt.id.slice(-8)}`, "info")} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-blue-50">
                            <Edit2 className="w-3.5 h-3.5 text-blue-500" />
                          </button>
                          <button onClick={() => cancel(apt.id)} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50">
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-10 text-center text-sm" style={{ color: "var(--admin-muted)" }}>
                      No appointments match the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <BookAppointmentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
