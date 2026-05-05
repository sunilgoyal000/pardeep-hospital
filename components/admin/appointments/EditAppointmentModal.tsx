"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { AppointmentView } from "@/modules/appointments/schema";

interface Props {
  appointment: AppointmentView | null;
  onClose: () => void;
  onSuccess: () => void;
}

const inputStyle: React.CSSProperties = {
  background: "var(--admin-surface)",
  border: "1px solid var(--admin-border)",
  color: "var(--admin-text)",
};

const STATUS_OPTIONS = [
  { value: "BOOKED", label: "Pending (booked)" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "NO_SHOW", label: "No-show" },
] as const;

const DEFAULT_DURATION_MIN = 30;

export default function EditAppointmentModal({ appointment, onClose, onSuccess }: Props) {
  const { showToast } = useToast();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [status, setStatus] = useState<typeof STATUS_OPTIONS[number]["value"]>("BOOKED");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!appointment) return;
    setDate(appointment.date);
    // appointment.time is "h:mm AM/PM" — convert to 24h "HH:mm" for the time input
    const parsed = parseDisplayTime(appointment.time);
    setTime(parsed);
    // Map UI status back to enum
    setStatus(uiStatusToEnum(appointment.status));
    setError(null);
  }, [appointment]);

  if (!appointment) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!appointment) return;
    setError(null);

    if (!date || !time) {
      setError("Date and time are required.");
      return;
    }
    const slotStart = new Date(`${date}T${time}`);
    if (Number.isNaN(slotStart.getTime())) {
      setError("Invalid date/time.");
      return;
    }
    const slotEnd = new Date(slotStart.getTime() + DEFAULT_DURATION_MIN * 60 * 1000);

    setSubmitting(true);
    try {
      const res = await fetch(`/api/appointments/${appointment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          slotStart: slotStart.toISOString(),
          slotEnd: slotEnd.toISOString(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg =
          body.error === "CONFLICT"
            ? "That slot is already booked for this doctor."
            : body.message || "Failed to update appointment.";
        setError(msg);
        return;
      }
      showToast("Appointment updated", "success");
      onSuccess();
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <form
          onSubmit={submit}
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
          style={{ background: "var(--admin-card)" }}
        >
          <h2 className="font-bold text-lg mb-1" style={{ color: "var(--admin-text)" }}>Edit Appointment</h2>
          <p className="text-xs mb-5" style={{ color: "var(--admin-muted)" }}>
            {appointment.patient} · {appointment.doctor}
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as typeof status)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputStyle}
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-xs font-medium" style={{ color: "#dc2626" }}>{error}</p>
          )}

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
              style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}
            >
              {submitting ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function parseDisplayTime(t: string): string {
  // "3:30 PM" -> "15:30"
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(t.trim());
  if (!m) return "";
  let hh = Number(m[1]);
  const mm = m[2];
  const ampm = m[3].toUpperCase();
  if (ampm === "PM" && hh !== 12) hh += 12;
  if (ampm === "AM" && hh === 12) hh = 0;
  return `${String(hh).padStart(2, "0")}:${mm}`;
}

function uiStatusToEnum(s: AppointmentView["status"]): "BOOKED" | "CONFIRMED" | "COMPLETED" | "CANCELLED" {
  switch (s) {
    case "Pending": return "BOOKED";
    case "Confirmed": return "CONFIRMED";
    case "Completed": return "COMPLETED";
    case "Cancelled": return "CANCELLED";
  }
}
