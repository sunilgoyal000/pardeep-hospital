"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { DoctorView } from "@/modules/doctors/schema";
import type { PatientView } from "@/modules/patients/schema";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_DURATION_MIN = 30;

export default function BookAppointmentModal({ open, onClose, onSuccess }: Props) {
  const { showToast } = useToast();

  const [doctors, setDoctors] = useState<DoctorView[]>([]);
  const [patients, setPatients] = useState<PatientView[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(false);

  const [doctorId, setDoctorId] = useState("");
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingRefs(true);
    Promise.all([
      fetch("/api/doctors").then((r) => r.json()),
      fetch("/api/patients?limit=100").then((r) => r.json()),
    ])
      .then(([d, p]) => {
        if (cancelled) return;
        setDoctors(d.data ?? []);
        setPatients(p.data ?? []);
      })
      .catch(() => !cancelled && showToast("Failed to load doctors/patients", "error"))
      .finally(() => !cancelled && setLoadingRefs(false));
    return () => {
      cancelled = true;
    };
  }, [open, showToast]);

  function reset() {
    setDoctorId("");
    setPatientId("");
    setDate("");
    setTime("");
    setNotes("");
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!doctorId || !patientId || !date || !time) {
      setError("All fields except notes are required.");
      return;
    }
    const slotStart = new Date(`${date}T${time}`);
    if (Number.isNaN(slotStart.getTime())) {
      setError("Invalid date/time.");
      return;
    }
    if (slotStart < new Date()) {
      setError("Cannot book a slot in the past.");
      return;
    }
    const slotEnd = new Date(slotStart.getTime() + DEFAULT_DURATION_MIN * 60 * 1000);

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId,
          patientId,
          slotStart: slotStart.toISOString(),
          slotEnd: slotEnd.toISOString(),
          notes: notes.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg =
          body.error === "CONFLICT"
            ? "That slot is already booked for this doctor."
            : body.message || "Failed to book appointment.";
        setError(msg);
        return;
      }
      showToast("Appointment booked successfully!", "success");
      reset();
      onSuccess();
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <form
          onSubmit={submit}
          className="w-full max-w-lg rounded-2xl p-6 shadow-2xl"
          style={{ background: "var(--admin-card)" }}
        >
          <h2 className="font-bold text-lg mb-5" style={{ color: "var(--admin-text)" }}>
            Book New Appointment
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Patient" colSpan={2}>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                disabled={loadingRefs}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputStyle}
              >
                <option value="">{loadingRefs ? "Loading…" : "Select patient"}</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                    {p.email ? ` — ${p.email}` : ""}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Doctor">
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                disabled={loadingRefs}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputStyle}
              >
                <option value="">{loadingRefs ? "Loading…" : "Select doctor"}</option>
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.department ?? d.specialty}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Department">
              <input
                type="text"
                readOnly
                value={doctors.find((d) => d.id === doctorId)?.department ?? ""}
                placeholder="Auto-selected"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={{ ...inputStyle, color: "var(--admin-muted)" }}
              />
            </Field>

            <Field label="Date">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
            </Field>

            <Field label="Time">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
            </Field>

            <Field label="Notes (optional)" colSpan={2}>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Chief complaint…"
                maxLength={2000}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
            </Field>
          </div>

          {error && (
            <p className="mt-4 text-xs font-medium" style={{ color: "#dc2626" }}>
              {error}
            </p>
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
              disabled={submitting || loadingRefs}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}
            >
              {submitting ? "Booking…" : "Book Appointment"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  background: "var(--admin-surface)",
  border: "1px solid var(--admin-border)",
  color: "var(--admin-text)",
};

function Field({
  label,
  colSpan = 1,
  children,
}: {
  label: string;
  colSpan?: 1 | 2;
  children: React.ReactNode;
}) {
  return (
    <div className={colSpan === 2 ? "col-span-2" : ""}>
      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
