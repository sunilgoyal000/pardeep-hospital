"use client";
import { useState } from "react";
import { Plus, Shield, ShieldCheck, ShieldAlert, User, Mail, MoreHorizontal, Edit2, Trash2, Key } from "lucide-react";
import { adminUsers } from "@/data/admin";
import { useToast } from "@/components/admin/ui/ToastProvider";

const roleStyles: Record<string, { bg: string; color: string; icon: any }> = {
  "Super Admin": { bg: "#fee2e2", color: "#dc2626", icon: ShieldAlert },
  "Admin": { bg: "#ede9fe", color: "#7c3aed", icon: ShieldCheck },
  "Receptionist": { bg: "#dcfce7", color: "#16a34a", icon: Shield },
  "Staff": { bg: "#f1f5f9", color: "#64748b", icon: User },
};

export default function UsersRolesPage() {
  const { showToast } = useToast();
  const [users, setUsers] = useState(adminUsers);
  const [showModal, setShowModal] = useState(false);

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    showToast("User removed successfully", "error");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Users & Role Management</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>Control access and staff permissions</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Role summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(roleStyles).map(([role, style]) => (
          <div
            key={role}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: style.bg }}>
              <style.icon className="w-5 h-5" style={{ color: style.color }} />
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: "var(--admin-text)" }}>
                {users.filter(u => u.role === role).length}
              </p>
              <p className="text-xs font-medium" style={{ color: "var(--admin-muted)" }}>{role}s</p>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--admin-border)" }}>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--admin-muted)" }}>User</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--admin-muted)" }}>Role</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--admin-muted)" }}>Department</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--admin-muted)" }}>Status</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--admin-muted)" }}>Last Login</th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-right" style={{ color: "var(--admin-muted)" }}>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--admin-border)" }}>
              {users.map((user) => {
                const style = roleStyles[user.role] || roleStyles.Staff;
                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #0d9488, #0891b2)" }}
                        >
                          {user.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "var(--admin-text)" }}>{user.name}</p>
                          <p className="text-xs" style={{ color: "var(--admin-muted)" }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg w-fit" style={{ background: style.bg, color: style.color }}>
                        <style.icon className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: "var(--admin-text)" }}>{user.dept}</td>
                    <td className="px-6 py-4">
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          background: user.status === "Active" ? "#dcfce7" : "#f1f5f9",
                          color: user.status === "Active" ? "#16a34a" : "#64748b",
                        }}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs" style={{ color: "var(--admin-muted)" }}>{user.lastLogin}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => showToast(`Editing permissions for ${user.name}`, "info")}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
                          title="Edit Permissions"
                        >
                          <Key className="w-4 h-4" style={{ color: "var(--admin-muted)" }} />
                        </button>
                        <button
                          onClick={() => showToast(`Editing ${user.name}`, "info")}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" style={{ color: "var(--admin-muted)" }} />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Guide */}
      <div className="rounded-2xl p-5" style={{ background: "#f8fafc", border: "1px dashed var(--admin-border)" }}>
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "var(--admin-text)" }}>
          <ShieldCheck className="w-4 h-4 text-teal-600" /> Role Permissions Guide
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { role: "Super Admin", desc: "Full access to all modules, finance, and system settings." },
            { role: "Admin", desc: "Access to patient, doctor, and department management." },
            { role: "Receptionist", desc: "Manage appointments, registrations, and live queues." },
            { role: "Staff", desc: "View assignments and specific department tasks." },
          ].map((item) => (
            <div key={item.role}>
              <p className="text-xs font-bold mb-1" style={{ color: "var(--admin-text)" }}>{item.role}</p>
              <p className="text-xs leading-relaxed" style={{ color: "var(--admin-muted)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: "var(--admin-card)" }}>
              <h2 className="font-bold text-lg mb-5" style={{ color: "var(--admin-text)" }}>Add New Staff Member</h2>
              <div className="space-y-4">
                {[
                  { label: "Full Name", placeholder: "e.g. John Doe" },
                  { label: "Email Address", placeholder: "john@pardeephospital.com" },
                  { label: "Role", placeholder: "Select role" },
                  { label: "Department", placeholder: "Select department" },
                  { label: "Initial Password", placeholder: "Temporary password" },
                ].map(({ label, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>{label}</label>
                    <input
                      type="text"
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", color: "var(--admin-text)" }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border" style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}>Cancel</button>
                <button onClick={() => { setShowModal(false); showToast("User invited successfully", "success"); }} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}>Create User</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
