import type { AppointmentView } from "@/modules/appointments/schema";

export interface KpiBlock {
  totalPatients: number;
  activeQueues: number;        // proxy: appointments scheduled in next 24h
  appointmentsToday: number;
  revenueToday: number;        // sum of consultFee for COMPLETED appointments today
  patientGrowth: number;       // % vs previous 30-day window
  queueGrowth: number;         // % vs same window yesterday
  appointmentGrowth: number;   // % vs same day last week
  revenueGrowth: number;       // % vs yesterday
}

export interface WeeklyTrendPoint {
  day: string;     // Mon, Tue, ...
  date: string;    // YYYY-MM-DD
  patients: number;     // unique patient count that day
  appointments: number; // total appointments that day
}

export interface DeptBreakdownItem {
  id: string;
  name: string;
  color: string;
  patients: number; // appointment count this week
  pct: number;      // 0-100, share of week total
}

export interface ActivityItem {
  id: string;
  type: "appointment" | "patient" | "doctor" | "system";
  msg: string;
  status: "new" | "active" | "done" | "cancelled" | "warning";
  createdAt: string; // ISO
}

export interface DashboardOverview {
  kpis: KpiBlock;
  weeklyTrend: WeeklyTrendPoint[];
  deptBreakdown: DeptBreakdownItem[];
  recentActivity: ActivityItem[];
  todaysAppointments: AppointmentView[];
  weekTotal: number;
}
