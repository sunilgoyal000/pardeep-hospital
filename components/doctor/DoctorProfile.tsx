"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Clock,
  Users,
  Award,
  CheckCircle,
  Upload,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react";

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  patients: number;
  rating: number;
  available: boolean;
  image: string;
  fee: number;
  about: string;
  qualifications: string[];
  schedule: { day: string; slots: string[] }[];
};

// Generate next 7 days
function getNextDays() {
  const days = [];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      dayName: i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayNames[d.getDay()],
      date: d.getDate(),
      month: monthNames[d.getMonth()],
      fullDay: dayNames[d.getDay()],
    });
  }
  return days;
}

type Tab = "appointment" | "schedule" | "about";

export default function DoctorProfile({ doctor }: { doctor: Doctor }) {
  const [activeTab, setActiveTab] = useState<Tab>("appointment");
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState("");
  const [booked, setBooked] = useState(false);

  const days = getNextDays();
  const allSlots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"];
  const bookedSlots = ["9:30 AM", "10:30 AM", "3:30 PM"];

  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>
      {/* Back header */}
      <div
        className="sticky top-0 z-30 px-5 py-4 flex items-center gap-3"
        style={{
          background: "var(--color-card)",
          borderBottom: "1px solid var(--color-border)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Link
          href="/"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: "var(--color-surface)" }}
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: "var(--color-text)" }} />
        </Link>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm truncate" style={{ color: "var(--color-text)" }}>
            {doctor.name}
          </p>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {doctor.specialization}
          </p>
        </div>
        <span className={`badge ${doctor.available ? "badge-success" : "badge-warning"}`}>
          {doctor.available ? "Available" : "Busy"}
        </span>
      </div>

      {/* Hero Profile Card */}
      <div className="px-5 py-6">
        <div
          className="rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0d9488 0%, #0891b2 100%)",
            boxShadow: "0 8px 32px rgb(13 148 136 / 0.3)",
          }}
        >
          <div className="absolute -top-6 -right-6 w-40 h-40 rounded-full opacity-10 bg-white" />
          <div className="flex items-start gap-4 relative z-10">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white/40 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h1 className="text-white font-bold text-lg">{doctor.name}</h1>
              <p className="text-teal-100 text-sm">{doctor.specialization}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="text-white font-bold text-sm">{doctor.rating}</span>
                <span className="text-teal-200 text-xs">({doctor.patients.toLocaleString()} patients)</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 relative z-10">
            {[
              { label: "Experience", value: `${doctor.experience}yr`, icon: Award },
              { label: "Patients", value: `${(doctor.patients / 1000).toFixed(1)}K`, icon: Users },
              { label: "Consult Fee", value: `₹${doctor.fee}`, icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="rounded-xl p-3 flex flex-col items-center text-center bg-white/15 backdrop-blur-sm"
              >
                <Icon className="w-4 h-4 text-teal-100 mb-1" />
                <p className="text-white font-bold text-sm">{value}</p>
                <p className="text-teal-200 text-xs">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div
          className="flex rounded-2xl p-1"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
        >
          {(["appointment", "schedule", "about"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 capitalize"
              style={{
                background: activeTab === tab
                  ? "linear-gradient(135deg, #0d9488, #0891b2)"
                  : "transparent",
                color: activeTab === tab ? "white" : "var(--color-text-muted)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-5 pb-8">
        {/* APPOINTMENT TAB */}
        {activeTab === "appointment" && (
          <div className="space-y-5">
            {booked ? (
              <div
                className="rounded-2xl p-8 flex flex-col items-center text-center"
                style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                  style={{ background: "#d1fae5" }}
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: "var(--color-text)" }}>
                  Appointment Booked!
                </h3>
                <p className="text-sm mb-1" style={{ color: "var(--color-text-muted)" }}>
                  {days[selectedDayIdx].dayName}, {days[selectedDayIdx].date} {days[selectedDayIdx].month}
                </p>
                <p className="font-semibold" style={{ color: "var(--color-primary)" }}>{selectedSlot}</p>
                <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
                  Token #PH-{Math.floor(Math.random() * 900) + 100} will be sent via SMS
                </p>
                <button
                  onClick={() => { setBooked(false); setSelectedSlot(null); }}
                  className="btn-outline mt-6 w-full"
                >
                  Book Another
                </button>
              </div>
            ) : (
              <>
                {/* Date Selector */}
                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-text)" }}>
                    Select Date
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {days.map((day, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedDayIdx(idx); setSelectedSlot(null); }}
                        className="flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl transition-all duration-200"
                        style={{
                          background: selectedDayIdx === idx
                            ? "linear-gradient(135deg, #0d9488, #0891b2)"
                            : "var(--color-card)",
                          border: `1px solid ${selectedDayIdx === idx ? "transparent" : "var(--color-border)"}`,
                          color: selectedDayIdx === idx ? "white" : "var(--color-text-muted)",
                          boxShadow: selectedDayIdx === idx ? "0 4px 12px rgb(13 148 136 / 0.3)" : "none",
                        }}
                      >
                        <span className="text-xs font-medium">{day.dayName}</span>
                        <span className="text-xl font-bold my-0.5">{day.date}</span>
                        <span className="text-xs">{day.month}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                      Available Slots
                    </p>
                    <div className="flex items-center gap-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded inline-block" style={{ background: "#d1fae5" }} /> Free
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 rounded inline-block" style={{ background: "#fee2e2" }} /> Booked
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {allSlots.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      const isSelected = selectedSlot === slot;
                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => setSelectedSlot(slot)}
                          className="py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                          style={{
                            background: isBooked
                              ? "#fee2e2"
                              : isSelected
                              ? "linear-gradient(135deg, #0d9488, #0891b2)"
                              : "var(--color-card)",
                            color: isBooked
                              ? "#ef4444"
                              : isSelected
                              ? "white"
                              : "var(--color-text)",
                            border: `1px solid ${isBooked ? "#fca5a5" : isSelected ? "transparent" : "var(--color-border)"}`,
                            cursor: isBooked ? "not-allowed" : "pointer",
                            boxShadow: isSelected ? "0 4px 12px rgb(13 148 136 / 0.3)" : "none",
                          }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Symptoms */}
                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-text)" }}>
                    Describe Symptoms <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>(optional)</span>
                  </p>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    rows={3}
                    placeholder="e.g. chest pain, shortness of breath..."
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all duration-200"
                    style={{
                      background: "var(--color-card)",
                      border: "1.5px solid var(--color-border)",
                      color: "var(--color-text)",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#0d9488")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-border)")}
                  />
                </div>

                {/* Document Upload */}
                <div>
                  <p className="text-sm font-semibold mb-3" style={{ color: "var(--color-text)" }}>
                    Attach Documents <span style={{ color: "var(--color-text-muted)", fontWeight: 400 }}>(optional)</span>
                  </p>
                  <label
                    className="flex flex-col items-center gap-2 py-6 rounded-2xl cursor-pointer transition-all duration-200 hover:border-teal-400"
                    style={{
                      border: "2px dashed var(--color-border)",
                      background: "var(--color-surface)",
                    }}
                  >
                    <Upload className="w-8 h-8" style={{ color: "var(--color-primary)" }} />
                    <span className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                      Tap to upload reports
                    </span>
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      PDF, JPG, PNG up to 10MB
                    </span>
                    <input type="file" className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png" />
                  </label>
                </div>

                {/* Book Button */}
                <button
                  disabled={!selectedSlot}
                  onClick={() => selectedSlot && setBooked(true)}
                  className="btn-primary w-full py-3.5 text-base"
                  style={{
                    opacity: selectedSlot ? 1 : 0.5,
                    cursor: selectedSlot ? "pointer" : "not-allowed",
                  }}
                >
                  {selectedSlot ? `Book — ${selectedSlot}` : "Select a time slot"}
                </button>
              </>
            )}
          </div>
        )}

        {/* SCHEDULE TAB */}
        {activeTab === "schedule" && (
          <div className="space-y-4">
            <div
              className="rounded-xl p-3 flex items-center gap-2"
              style={{ background: "#ccfbf1" }}
            >
              <Calendar className="w-4 h-4" style={{ color: "#0f766e" }} />
              <p className="text-xs font-medium" style={{ color: "#0f766e" }}>
                Weekly schedule — Consultation hours
              </p>
            </div>
            {doctor.schedule.map((s) => (
              <div
                key={s.day}
                className="card p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
                    {s.day}
                  </span>
                  <span className="badge badge-success">{s.slots.length} slots</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.slots.map((slot) => (
                    <span
                      key={slot}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg"
                      style={{ background: "var(--color-surface)", color: "var(--color-primary)" }}
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === "about" && (
          <div className="space-y-5">
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--color-text)" }}>
                About
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                {doctor.about}
              </p>
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--color-text)" }}>
                Qualifications
              </h3>
              <div className="space-y-2">
                {doctor.qualifications.map((q) => (
                  <div key={q} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "var(--color-primary)" }} />
                    <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>{q}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-sm mb-3" style={{ color: "var(--color-text)" }}>
                Contact & Location
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                  <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    Pardeep Hospital, Ludhiana, Punjab
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                  <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    +91 98765 43210
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
