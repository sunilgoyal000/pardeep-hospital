import { prisma } from "@/server/db";
import { AppError } from "@/server/errors";
import { ROLES } from "@/shared/constants/roles";
import type { SessionUser } from "@/shared/types/auth";
import { appointmentsRepo } from "@/modules/appointments/repository";
import { toView as toAppointmentView } from "@/modules/appointments/view";
import type {
  ActivityItem,
  DashboardOverview,
  DeptBreakdownItem,
  KpiBlock,
  WeeklyTrendPoint,
} from "./schema";

const STAFF_ROLES = [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.DOCTOR] as const;
const DEPT_COLORS = ["#ec4899", "#8b5cf6", "#f59e0b", "#0891b2", "#22c55e", "#f43f5e", "#3b82f6", "#10b981"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function pctChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

async function computeKpis(): Promise<KpiBlock> {
  const now = new Date();
  const today = startOfDay(now);
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [
    totalPatients,
    patientsLast30,
    patientsPrev30,
    activeQueues,
    queuesYesterday,
    appointmentsToday,
    appointmentsSameDayLastWeek,
    revenueTodayAgg,
    revenueYesterdayAgg,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.patient.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.patient.count({ where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } } }),
    prisma.appointment.count({
      where: { slotStart: { gte: now, lt: tomorrow }, status: { in: ["BOOKED", "CONFIRMED"] } },
    }),
    prisma.appointment.count({
      where: { slotStart: { gte: yesterday, lt: today }, status: { in: ["BOOKED", "CONFIRMED"] } },
    }),
    prisma.appointment.count({ where: { slotStart: { gte: today, lt: tomorrow } } }),
    prisma.appointment.count({
      where: { slotStart: { gte: weekAgo, lt: new Date(weekAgo.getTime() + 24 * 60 * 60 * 1000) } },
    }),
    prisma.appointment.findMany({
      where: { slotStart: { gte: today, lt: tomorrow }, status: "COMPLETED" },
      select: { doctor: { select: { consultFee: true } } },
    }),
    prisma.appointment.findMany({
      where: { slotStart: { gte: yesterday, lt: today }, status: "COMPLETED" },
      select: { doctor: { select: { consultFee: true } } },
    }),
  ]);

  const revenueToday = revenueTodayAgg.reduce((sum, r) => sum + Number(r.doctor.consultFee), 0);
  const revenueYesterday = revenueYesterdayAgg.reduce((sum, r) => sum + Number(r.doctor.consultFee), 0);

  return {
    totalPatients,
    activeQueues,
    appointmentsToday,
    revenueToday,
    patientGrowth: pctChange(patientsLast30, patientsPrev30),
    queueGrowth: pctChange(activeQueues, queuesYesterday),
    appointmentGrowth: pctChange(appointmentsToday, appointmentsSameDayLastWeek),
    revenueGrowth: pctChange(revenueToday, revenueYesterday),
  };
}

async function computeWeeklyTrend(): Promise<WeeklyTrendPoint[]> {
  const today = startOfDay(new Date());
  const weekAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);

  const rows = await prisma.appointment.findMany({
    where: { slotStart: { gte: weekAgo, lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) } },
    select: { slotStart: true, patientId: true },
  });

  const buckets = new Map<string, { patients: Set<string>; appointments: number }>();
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekAgo.getTime() + i * 24 * 60 * 60 * 1000);
    const key = d.toISOString().slice(0, 10);
    buckets.set(key, { patients: new Set(), appointments: 0 });
  }
  for (const r of rows) {
    const key = startOfDay(r.slotStart).toISOString().slice(0, 10);
    const b = buckets.get(key);
    if (!b) continue;
    b.patients.add(r.patientId);
    b.appointments += 1;
  }

  return Array.from(buckets.entries()).map(([date, b]) => ({
    date,
    day: DAY_NAMES[new Date(date).getDay()],
    patients: b.patients.size,
    appointments: b.appointments,
  }));
}

async function computeDeptBreakdown(): Promise<{ items: DeptBreakdownItem[]; total: number }> {
  const today = startOfDay(new Date());
  const weekAgo = new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000);

  const grouped = await prisma.appointment.groupBy({
    by: ["doctorId"],
    where: { slotStart: { gte: weekAgo } },
    _count: { _all: true },
  });

  if (grouped.length === 0) return { items: [], total: 0 };

  const doctorIds = grouped.map((g) => g.doctorId);
  const doctors = await prisma.doctor.findMany({
    where: { id: { in: doctorIds } },
    select: {
      id: true,
      department: { select: { id: true, name: true } },
      specialty: true,
    },
  });
  const doctorById = new Map(doctors.map((d) => [d.id, d]));

  const byDept = new Map<string, { id: string; name: string; patients: number }>();
  for (const g of grouped) {
    const doc = doctorById.get(g.doctorId);
    const id = doc?.department?.id ?? `spec:${doc?.specialty ?? "unknown"}`;
    const name = doc?.department?.name ?? doc?.specialty ?? "Unknown";
    const cur = byDept.get(id) ?? { id, name, patients: 0 };
    cur.patients += g._count._all;
    byDept.set(id, cur);
  }

  const list = Array.from(byDept.values()).sort((a, b) => b.patients - a.patients);
  const total = list.reduce((s, d) => s + d.patients, 0);

  const items: DeptBreakdownItem[] = list.map((d, i) => ({
    id: d.id,
    name: d.name,
    color: DEPT_COLORS[i % DEPT_COLORS.length],
    patients: d.patients,
    pct: total === 0 ? 0 : Math.round((d.patients / total) * 100),
  }));

  return { items, total };
}

async function computeRecentActivity(): Promise<ActivityItem[]> {
  const rows = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { user: { select: { name: true } } },
  });

  return rows.map((r) => mapAudit(r));
}

function mapAudit(r: {
  id: string;
  action: string;
  entity: string;
  createdAt: Date;
  user: { name: string | null } | null;
}): ActivityItem {
  const actor = r.user?.name ?? "System";
  let type: ActivityItem["type"] = "system";
  let status: ActivityItem["status"] = "new";
  let msg = `${r.action} on ${r.entity}`;

  if (r.entity === "Appointment") {
    type = "appointment";
    if (r.action === "appointment.create") {
      status = "new";
      msg = `New appointment booked by ${actor}`;
    } else if (r.action === "appointment.cancel") {
      status = "cancelled";
      msg = `Appointment cancelled by ${actor}`;
    } else if (r.action === "appointment.update") {
      status = "active";
      msg = `Appointment updated by ${actor}`;
    }
  } else if (r.entity === "Patient") {
    type = "patient";
    msg = `Patient ${r.action} by ${actor}`;
  } else if (r.entity === "Doctor") {
    type = "doctor";
    msg = `Doctor ${r.action} by ${actor}`;
  }

  return {
    id: r.id,
    type,
    status,
    msg,
    createdAt: r.createdAt.toISOString(),
  };
}

export const dashboardService = {
  async getOverview(actor: SessionUser): Promise<DashboardOverview> {
    if (!STAFF_ROLES.includes(actor.role as typeof STAFF_ROLES[number])) {
      throw new AppError("FORBIDDEN");
    }

    const today = startOfDay(new Date());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const [kpis, weeklyTrend, dept, activity, todays] = await Promise.all([
      computeKpis(),
      computeWeeklyTrend(),
      computeDeptBreakdown(),
      computeRecentActivity(),
      appointmentsRepo.list(
        { from: today, to: tomorrow, limit: 5 },
        {}
      ),
    ]);

    return {
      kpis,
      weeklyTrend,
      deptBreakdown: dept.items,
      recentActivity: activity,
      todaysAppointments: todays.map(toAppointmentView),
      weekTotal: dept.total,
    };
  },
};
