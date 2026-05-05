"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { DoctorAdminView } from "@/modules/doctors/schema";
import type { DepartmentView } from "@/modules/departments/schema";

interface Props {
  doctor: DoctorAdminView | null;
  onClose: () => void;
  onSuccess: () => void;
}

const inputStyle: React.CSSProperties = {
  background: "var(--admin-surface)",
  border: "1px solid var(--admin-border)",
  color: "var(--admin-text)",
};

export default function EditDoctorModal({ doctor, onClose, onSuccess }: Props) {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState<DepartmentView[]>([]);

  const [specialty, setSpecialty] = useState("");
  const [consultFee, setConsultFee] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [experienceYears, setExperienceYears] = useState("");
  const [rating, setRating] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!doctor) return;
    setSpecialty(doctor.specialty);
    setConsultFee(String(doctor.consultFee ?? ""));
    setDepartmentId("");
    setIsAvailable(doctor.isAvailable);
    setExperienceYears(doctor.experienceYears != null ? String(doctor.experienceYears) : "");
    setRating(doctor.rating != null ? String(doctor.rating) : "");
    setImageUrl(doctor.imageUrl ?? "");
    setError(null);

    if (departments.length === 0) {
      fetch("/api/departments")
        .then((r) => r.json())
        .then((j) => setDepartments(j.data ?? []))
        .catch(() => showToast("Failed to load departments", "error"));
    }
  }, [doctor, departments.length, showToast]);

  if (!doctor) return null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!doctor) return;
    setError(null);

    const body: Record<string, unknown> = {
      specialty: specialty.trim(),
      consultFee: consultFee ? Number(consultFee) : 0,
      isAvailable,
    };
    if (departmentId) body.departmentId = departmentId;
    if (experienceYears) body.experienceYears = Number(experienceYears);
    else body.experienceYears = null;
    if (rating) body.rating = Number(rating);
    else body.rating = null;
    if (imageUrl.trim()) body.imageUrl = imageUrl.trim();
    else body.imageUrl = null;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/doctors/${doctor.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.message || "Failed to update doctor.");
        return;
      }
      showToast(`${doctor.name} updated`, "success");
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
          className="w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          style={{ background: "var(--admin-card)" }}
        >
          <h2 className="font-bold text-lg mb-1" style={{ color: "var(--admin-text)" }}>Edit Doctor Profile</h2>
          <p className="text-xs mb-5" style={{ color: "var(--admin-muted)" }}>
            {doctor.name} · name &amp; email changes via Users page
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>Specialty</label>
              <input type="text" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>Department</label>
              <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle}>
                <option value="">— No change —</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>Consult Fee (₹)</label>
              <input type="number" min={0} value={consultFee} onChange={(e) => setConsultFee(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>Experience (years)</label>
              <input type="number" min={0} max={80} value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>Rating (0–5)</label>
              <input type="number" min={0} max={5} step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>Image URL</label>
              <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" className="w-full px-3 py-2.5 rounded-xl text-sm outline-none" style={inputStyle} />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 text-sm" style={{ color: "var(--admin-text)" }}>
                <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
                Available for new appointments
              </label>
            </div>
          </div>

          {error && <p className="mt-4 text-xs font-medium" style={{ color: "#dc2626" }}>{error}</p>}

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} disabled={submitting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}>Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50" style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}>
              {submitting ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
