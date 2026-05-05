"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { PatientView } from "@/modules/patients/schema";

interface Props {
  patient: PatientView | null;
  onClose: () => void;
  onSuccess: () => void;
}

const inputStyle: React.CSSProperties = {
  background: "var(--admin-surface)",
  border: "1px solid var(--admin-border)",
  color: "var(--admin-text)",
};

export default function EditPatientModal({ patient, onClose, onSuccess }: Props) {
  const { showToast } = useToast();
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"" | "MALE" | "FEMALE" | "OTHER">("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!patient) return;
    // PatientView doesn't carry raw dob; derive from age only if available — better to leave blank
    // and let the user re-enter, since admins editing should know the dob explicitly.
    setDob("");
    setGender(patient.gender ?? "");
    setBloodGroup(patient.bloodGroup ?? "");
    setError(null);
  }, [patient]);

  if (!patient) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!patient) return;
    setError(null);

    const body: Record<string, unknown> = {};
    if (dob) body.dob = new Date(dob).toISOString();
    if (gender) body.gender = gender;
    if (bloodGroup.trim()) body.bloodGroup = bloodGroup.trim();

    if (Object.keys(body).length === 0) {
      setError("Nothing to update.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/patients/${patient.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.message || "Failed to update patient.");
        return;
      }
      showToast(`${patient.name} updated`, "success");
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
          <h2 className="font-bold text-lg mb-1" style={{ color: "var(--admin-text)" }}>Edit Patient Profile</h2>
          <p className="text-xs mb-5" style={{ color: "var(--admin-muted)" }}>
            {patient.name} · name &amp; phone changes via Users page
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>Date of Birth</label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as typeof gender)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                >
                  <option value="">—</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>Blood Group</label>
                <input
                  type="text"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  placeholder="A+, B-, etc."
                  maxLength={8}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {error && <p className="mt-4 text-xs font-medium" style={{ color: "#dc2626" }}>{error}</p>}

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
              {submitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
