"use client";
import { useState } from "react";
import {
  Settings, Bell, Shield, Lock, Globe, Mail, Phone,
  Camera, Save, RefreshCw, Smartphone, Monitor, Palette,
  Database, HardDrive, Cpu, Cloud,
} from "lucide-react";
import { useToast } from "@/components/admin/ui/ToastProvider";

const tabs = [
  { id: "general", label: "General", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "system", label: "System", icon: Database },
];

export default function SettingsPage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast("Settings updated successfully", "success");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>System Settings</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>Manage hospital configurations and system preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg transition-all disabled:opacity-50"
          style={{
            background: "linear-gradient(135deg, #0d9488, #0891b2)",
            boxShadow: "0 4px 12px rgb(13 148 136 / 0.2)",
          }}
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>

      <div className="grid lg:grid-cols-[240px_1fr] gap-6">
        {/* Navigation */}
        <div className="space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: isActive ? "#ccfbf1" : "transparent",
                  color: isActive ? "#0d9488" : "var(--admin-muted)",
                }}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              {/* Hospital Profile */}
              <div className="rounded-2xl p-6" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
                <h3 className="font-bold text-base mb-6" style={{ color: "var(--admin-text)" }}>Hospital Profile</h3>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-2xl bg-teal-50 flex items-center justify-center border-2 border-dashed border-teal-200 relative group overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=200&h=200" alt="Logo" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-xs font-semibold" style={{ color: "var(--admin-muted)" }}>Hospital Logo</p>
                  </div>

                  <div className="flex-1 grid md:grid-cols-2 gap-4">
                    {[
                      { label: "Hospital Name", value: "Pardeep Hospital & Eye Care", col: 2 },
                      { label: "Primary Phone", value: "+91 98765 43210" },
                      { label: "Email Address", value: "contact@pardeephospital.com" },
                      { label: "Website URL", value: "https://pardeephospital.com" },
                      { label: "Operating Hours", value: "24/7 (Emergency Available)" },
                      { label: "Registration ID", value: "REG-HOSP-2024-001" },
                      { label: "Address", value: "123 Medical Square, Main Road, City", col: 2 },
                    ].map((field) => (
                      <div key={field.label} className={field.col === 2 ? "md:col-span-2" : ""}>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>{field.label}</label>
                        <input
                          type="text"
                          defaultValue={field.value}
                          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-teal-100"
                          style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", color: "var(--admin-text)" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Localization */}
              <div className="rounded-2xl p-6" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
                <h3 className="font-bold text-base mb-4" style={{ color: "var(--admin-text)" }}>Localization</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: "System Language", value: "English (US)" },
                    { label: "Time Zone", value: "(GMT+05:30) India Standard Time" },
                    { label: "Currency", value: "INR (₹)" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>{field.label}</label>
                      <select
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
                        style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", color: "var(--admin-text)" }}
                      >
                        <option>{field.value}</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4">
              <div className="rounded-2xl p-6" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
                <h3 className="font-bold text-base mb-6" style={{ color: "var(--admin-text)" }}>Email & SMS Alerts</h3>
                <div className="space-y-6">
                  {[
                    { title: "Appointment Confirmations", desc: "Send automated email/SMS when a booking is confirmed.", icon: Mail },
                    { title: "Queue Status Updates", desc: "Notify patients when they are next in line.", icon: Smartphone },
                    { title: "Doctor Schedule Changes", desc: "Alert staff if a doctor's schedule is modified.", icon: Bell },
                    { title: "Inventory Alerts", desc: "Notify pharmacy staff when medicine stock is low.", icon: Database },
                  ].map((item) => (
                    <div key={item.title} className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0">
                          <item.icon className="w-5 h-5 text-slate-500" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "var(--admin-text)" }}>{item.title}</p>
                          <p className="text-xs" style={{ color: "var(--admin-muted)" }}>{item.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: "System Uptime", value: "99.98%", icon: Monitor, color: "#16a34a" },
                  { label: "Backup Status", value: "Healthy", icon: HardDrive, color: "#16a34a" },
                  { label: "CPU Usage", value: "14%", icon: Cpu, color: "#0d9488" },
                  { label: "Cloud Sync", value: "Active", icon: Cloud, color: "#0d9488" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl p-5 flex items-center gap-4" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                      <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <div>
                      <p className="text-xs font-medium" style={{ color: "var(--admin-muted)" }}>{stat.label}</p>
                      <p className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl p-6" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
                <h3 className="font-bold text-base mb-4" style={{ color: "var(--admin-text)" }}>Database Maintenance</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => showToast("Backup started...", "info")} className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 transition-colors" style={{ color: "var(--admin-text)" }}>Generate Full Backup</button>
                  <button onClick={() => showToast("Cleanup completed", "success")} className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 transition-colors" style={{ color: "var(--admin-text)" }}>Cleanup Cached Data</button>
                  <button onClick={() => showToast("System diagnostics running", "info")} className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 transition-colors" style={{ color: "var(--admin-text)" }}>Run Diagnostics</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="rounded-2xl p-6" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
               <h3 className="font-bold text-base mb-6" style={{ color: "var(--admin-text)" }}>Interface Preferences</h3>
               <div className="space-y-8">
                  <div>
                    <p className="text-sm font-semibold mb-3" style={{ color: "var(--admin-text)" }}>Theme Mode</p>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { id: "light", label: "Light", color: "#ffffff", border: "#e2e8f0" },
                        { id: "dark", label: "Dark", color: "#0f172a", border: "#1e293b" },
                        { id: "system", label: "System", color: "linear-gradient(135deg, #ffffff 50%, #0f172a 50%)", border: "#e2e8f0" },
                      ].map((theme) => (
                        <button key={theme.id} className="group relative">
                          <div className="h-20 rounded-xl border-2 transition-all group-hover:scale-105" style={{ background: theme.color, borderColor: theme.id === "light" ? "#0d9488" : theme.border }} />
                          <p className="text-xs font-medium mt-2" style={{ color: "var(--admin-muted)" }}>{theme.label}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-semibold mb-3" style={{ color: "var(--admin-text)" }}>Primary Brand Color</p>
                    <div className="flex flex-wrap gap-3">
                      {["#0d9488", "#0891b2", "#1e40af", "#7c3aed", "#be185d", "#c2410c"].map((color) => (
                        <button key={color} className="w-10 h-10 rounded-full border-2 border-white shadow-md transition-transform hover:scale-110" style={{ background: color, outline: color === "#0d9488" ? "2px solid #0d9488" : "none", outlineOffset: "2px" }} />
                      ))}
                    </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="rounded-2xl p-6" style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}>
                 <h3 className="font-bold text-base mb-6 flex items-center gap-2" style={{ color: "var(--admin-text)" }}>
                   <Lock className="w-4 h-4 text-red-500" /> Password & Authentication
                 </h3>
                 <div className="space-y-4 max-w-md">
                   {[
                     { label: "Current Password", type: "password" },
                     { label: "New Password", type: "password" },
                     { label: "Confirm New Password", type: "password" },
                   ].map((field) => (
                     <div key={field.label}>
                       <label className="block text-xs font-semibold mb-1.5" style={{ color: "var(--admin-muted)" }}>{field.label}</label>
                       <input
                         type={field.type}
                         className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                         style={{ background: "var(--admin-surface)", border: "1px solid var(--admin-border)", color: "var(--admin-text)" }}
                       />
                     </div>
                   ))}
                   <button className="text-xs font-bold text-teal-600 hover:underline">Enable Two-Factor Authentication (2FA)</button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
