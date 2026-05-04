"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/components/admin/ui/ToastProvider";
import type { Role } from "@/modules/users/schema";
import type { DepartmentView } from "@/modules/departments/schema";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLE_OPTIONS: Array<{ value: Role; label: string }> = [
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "DOCTOR", label: "Doctor" },
  { value: "PATIENT", label: "Patient" },
  { value: "PHARMACY", label: "Pharmacy" },
  { value: "LAB", label: "Lab" },
];

const inputStyle: React.CSSProperties = {
  background: "var(--admin-surface)",
  border: "1px solid var(--admin-border)",
  color: "var(--admin-text)",
};

export default function CreateUserModal({ open, onClose, onSuccess }: Props) {
  const { showToast } = useToast();

  const [role, setRole] = useState<Role>("ADMIN");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // Doctor-only
  const [departmentId, setDepartmentId] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [consultFee, setConsultFee] = useState("");
  const [experienceYears, setExperienceYears] = useState("");

  const [departments, setDepartments] = useState<DepartmentView[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || role !== "DOCTOR" || departments.length > 0) return;
    fetch("/api/departments")
      .then((r) => r.json())
      .then((j) => setDepartments(j.data ?? []))
      .catch(() => showToast("Failed to load departments", "error"));
  }, [open, role, departments.length, showToast]);

  function reset() {
    setRole("ADMIN");
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setDepartmentId("");
    setSpecialty("");
    setConsultFee("");
    setExperienceYears("");
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || password.length < 8) {
      setError("Name, email, and a password ≥ 8 chars are required.");
      return;
    }
    if (role === "DOCTOR" && !specialty.trim()) {
      setError("Specialty is required for doctor accounts.");
      return;
    }

    const payload: Record<string, unknown> = {
      role,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    };
    if (phone.trim()) payload.phone = phone.trim();
    if (role === "DOCTOR") {
      payload.specialty = specialty.trim();
      payload.consultFee = consultFee ? Number(consultFee) : 0;
      if (experienceYears) payload.experienceYears = Number(experienceYears);
      if (departmentId) payload.departmentId = departmentId;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const msg =
          body.error === "CONFLICT"
            ? "A user with that email already exists."
            : body.message || "Failed to create user.";
        setError(msg);
        return;
      }
      showToast(`${name} added successfully`, "success");
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
          className="w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
          style={{ background: "var(--admin-card)" }}
        >
          <h2 className="font-bold text-lg mb-5" style={{ color: "var(--admin-text)" }}>
            Add New User
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Role" colSpan={2}>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputStyle}
              >
                {ROLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Full Name" colSpan={2}>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. Anil Verma"
                maxLength={120}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@pardeep.local"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
            </Field>

            <Field label="Phone (optional)">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                maxLength={30}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
            </Field>

            <Field label="Password (≥ 8 chars)" colSpan={2}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Initial password — user can change later"
                minLength={8}
                maxLength={128}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                style={inputStyle}
              />
            </Field>

            {role === "DOCTOR" && (
              <>
                <Field label="Specialty" colSpan={2}>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="Cardiology, Orthopedics, etc."
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Department">
                  <select
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  >
                    <option value="">Unassigned</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Consult Fee (₹)">
                  <input
                    type="number"
                    value={consultFee}
                    onChange={(e) => setConsultFee(e.target.value)}
                    min={0}
                    placeholder="500"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Experience (years, optional)" colSpan={2}>
                  <input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    min={0}
                    max={80}
                    placeholder="10"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={inputStyle}
                  />
                </Field>
              </>
            )}
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
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}
            >
              {submitting ? "Creating…" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

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
