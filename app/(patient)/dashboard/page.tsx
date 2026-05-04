import type { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  Bell,
  ChevronRight,
  Clock,
  Users,
  Star,
  MapPin,
  ClipboardList,
  CalendarPlus,
  Activity,
  Pill,
  UserPlus,
  Stethoscope,
  TrendingUp,
  Shield,
} from "lucide-react";
import { doctors } from "@/data/doctors";
import { departments } from "@/data/departments";

export const metadata: Metadata = {
  title: "Patient Dashboard — Pardeep Hospital",
  description: "Manage your health appointments, track queue status, and view medical records in your personalized Pardeep Hospital dashboard.",
};

const quickActions = [
  { label: "Registration", icon: UserPlus, href: "/departments", color: "#0d9488", bg: "#f0fdfa" },
  { label: "Schedules", icon: Stethoscope, href: "/departments", color: "#0891b2", bg: "#f0f9ff" },
  { label: "Bookings", icon: CalendarPlus, href: `/doctors/dr-sharma`, color: "#4f46e5", bg: "#eef2ff" },
  { label: "Live Queue", icon: ClipboardList, href: "/queue", color: "#d97706", bg: "#fffbeb" },
  { label: "Pharmacy", icon: Pill, href: "/pharmacy", color: "#059669", bg: "#f0fdf4" },
];

export default function UserDashboard() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>
      {/* ── Hero Header ── */}
      <header
        className="relative overflow-hidden px-5 pt-10 pb-16"
        style={{
          background: "linear-gradient(135deg, #0d9488 0%, #0891b2 50%, #0e7490 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10"
          style={{ background: "white" }}
        />
        <div
          className="absolute top-20 -right-6 w-28 h-28 rounded-full opacity-10"
          style={{ background: "white" }}
        />

        {/* Top row */}
        <div className="flex items-start justify-between mb-6 relative z-10">
          <div>
            <p className="text-teal-100 text-sm font-medium">Good afternoon 👋</p>
            <h1 className="text-2xl font-bold text-white mt-1">Rahul Kumar</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin className="w-3 h-3 text-teal-200" />
              <span className="text-teal-200 text-xs">Ludhiana, Punjab</span>
            </div>
          </div>
          <div className="relative">
            <button
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-white" />
            </button>
            <span
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold"
            >
              3
            </span>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative z-10">
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white shadow-lg"
            style={{ boxShadow: "0 8px 32px rgb(0 0 0 / 0.12)" }}
          >
            <Search className="w-5 h-5 flex-shrink-0" style={{ color: "var(--color-primary)" }} />
            <input
              type="text"
              placeholder="Search doctors, clinics, departments..."
              className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-slate-400"
              style={{ color: "var(--color-text)" }}
            />
            <button
              className="text-xs font-semibold px-3 py-1.5 rounded-xl text-white"
              style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
            >
              Search
            </button>
          </div>
        </div>
      </header>

      {/* ── Active Queue Card ── */}
      <div className="px-5 -mt-6 relative z-20">
        <div
          className="rounded-2xl p-4 flex items-center gap-4"
          style={{
            background: "var(--color-card)",
            boxShadow: "0 8px 32px rgb(13 148 136 / 0.15)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #0d9488, #0891b2)",
              animation: "pulse-ring 2s infinite",
            }}
          >
            <span className="text-white font-bold text-lg">12</span>
            <span className="text-teal-100 text-xs">Queue</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="badge badge-success">Active</span>
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Token #PH-047</span>
            </div>
            <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
              Dr. Rajesh Sharma — Cardiology
            </p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" style={{ color: "var(--color-text-muted)" }} />
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>~25 min wait</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" style={{ color: "var(--color-text-muted)" }} />
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>5 ahead</span>
              </div>
            </div>
          </div>
          <Link href="/queue" className="btn-primary text-xs px-3 py-2">
            Track
          </Link>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="px-5 py-6 space-y-8">

        {/* Quick Actions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: "var(--color-text)" }}>Quick Actions</h2>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {quickActions.map(({ label, icon: Icon, href, color, bg }) => (
              <Link
                key={label}
                href={href}
                className="flex flex-col items-center gap-2 group"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-lg"
                  style={{ background: bg }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <span
                  className="text-xs font-medium text-center leading-tight"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Stats Row */}
        <section className="grid grid-cols-3 gap-3">
          {[
            { label: "Doctors", value: "38+", icon: Stethoscope, color: "#0d9488" },
            { label: "Happy Patients", value: "50K+", icon: TrendingUp, color: "#0891b2" },
            { label: "Years of Care", value: "25+", icon: Shield, color: "#8b5cf6" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="card p-4 flex flex-col items-center text-center"
            >
              <Icon className="w-6 h-6 mb-2" style={{ color }} />
              <p className="font-bold text-lg" style={{ color: "var(--color-text)" }}>{value}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{label}</p>
            </div>
          ))}
        </section>

        {/* Categories */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: "var(--color-text)" }}>Specialities</h2>
            <Link
              href="/departments"
              className="flex items-center gap-1 text-sm font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {departments.slice(0, 8).map((dept) => (
              <Link
                key={dept.id}
                href="/departments"
                className="card p-3 flex flex-col items-center text-center gap-2 group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-transform duration-200 group-hover:scale-110"
                  style={{ background: dept.color }}
                >
                  {dept.icon}
                </div>
                <span
                  className="text-xs font-medium leading-tight"
                  style={{ color: "var(--color-text)" }}
                >
                  {dept.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Doctors */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold" style={{ color: "var(--color-text)" }}>Top Doctors</h2>
            <Link
              href="/departments"
              className="flex items-center gap-1 text-sm font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {doctors.map((doc) => (
              <Link key={doc.id} href={`/doctors/${doc.id}`}>
                <div className="card p-4 flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                    {doc.available && (
                      <div
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                        style={{ background: "#22c55e" }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--color-text)" }}>
                      {doc.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                      {doc.specialization}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-medium" style={{ color: "var(--color-text)" }}>
                          {doc.rating}
                        </span>
                      </div>
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {doc.patients.toLocaleString()} patients
                      </span>
                      <span className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                        ₹{doc.fee}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`badge ${doc.available ? "badge-success" : "badge-warning"}`}
                    >
                      {doc.available ? "Available" : "Busy"}
                    </span>
                    <ChevronRight className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Upcoming Appointment Reminder */}
        <section>
          <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text)" }}>
            Upcoming Appointment
          </h2>
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0d9488, #0891b2)",
              boxShadow: "0 8px 24px rgb(13 148 136 / 0.3)",
            }}
          >
            <div
              className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-10"
              style={{ background: "white" }}
            />
            <div className="flex items-start justify-between relative z-10">
              <div>
                <span className="text-teal-200 text-xs font-medium">Tomorrow</span>
                <h3 className="text-white font-bold text-base mt-1">Dr. Rajesh Sharma</h3>
                <p className="text-teal-100 text-sm">Cardiology Consultation</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2.5 py-1">
                    <Clock className="w-3.5 h-3.5 text-white" />
                    <span className="text-white text-xs font-medium">3:30 PM</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2.5 py-1">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                    <span className="text-white text-xs font-medium">OPD Block A</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="bg-white text-xs font-semibold px-3 py-1.5 rounded-xl" style={{ color: "#0d9488" }}>
                  Reschedule
                </button>
                <button className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-xl">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Health Tips */}
        <section className="pb-4">
          <h2 className="text-base font-bold mb-4" style={{ color: "var(--color-text)" }}>Health Tips</h2>
          <div
            className="card p-4 flex items-start gap-3"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
              style={{ background: "#ccfbf1" }}
            >
              💧
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                Stay Hydrated Today
              </p>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Drink at least 8 glasses of water daily. Proper hydration supports kidney function, improves energy, and boosts immune health.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
