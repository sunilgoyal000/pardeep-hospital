"use client";
import { useState, useEffect } from "react";
import { Search, Users, Calendar, Activity, Pill, Settings, X, Command } from "lucide-react";
import { useRouter } from "next/navigation";

const searchItems = [
  { label: "Search Patients", href: "/admin/patients", icon: Users, shortcut: "P" },
  { label: "Manage Doctors", href: "/admin/doctors", icon: Users, shortcut: "D" },
  { label: "View Appointments", href: "/admin/appointments", icon: Calendar, shortcut: "A" },
  { label: "Live Queue Tracker", href: "/admin/queue", icon: Activity, shortcut: "Q" },
  { label: "Pharmacy Inventory", href: "/admin/pharmacy", icon: Pill, shortcut: "M" },
  { label: "System Settings", href: "/admin/settings", icon: Settings, shortcut: "S" },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const filtered = searchItems.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
      
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden relative z-10 animate-in fade-in zoom-in duration-200"
        style={{ border: "1px solid var(--admin-border)" }}
      >
        <div className="flex items-center px-4 py-3 border-b" style={{ borderColor: "var(--admin-border)" }}>
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Search modules, patients, or shortcuts..."
            className="flex-1 bg-transparent outline-none text-base"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded border bg-slate-50 text-[10px] font-bold text-slate-400">
            ESC
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length > 0 ? (
            <div className="space-y-1">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Navigation & Tools</p>
              {filtered.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    router.push(item.href);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-teal-50 group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-white">
                      <item.icon className="w-4 h-4 text-slate-500 group-hover:text-teal-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700 group-hover:text-teal-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-300 group-hover:text-teal-300">G THEN</span>
                    <span className="w-5 h-5 flex items-center justify-center rounded border bg-slate-50 text-[10px] font-bold text-slate-400 group-hover:border-teal-200 group-hover:text-teal-600">
                      {item.shortcut}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Command className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-400">No results found for "{query}"</p>
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-slate-50 border-t flex items-center justify-between" style={{ borderColor: "var(--admin-border)" }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="px-1 rounded border bg-white font-bold">↵</span>
              <span>to select</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
              <span className="px-1 rounded border bg-white font-bold">↑↓</span>
              <span>to navigate</span>
            </div>
          </div>
          <p className="text-[10px] font-medium text-slate-400">
            Press <span className="font-bold">⌘K</span> from anywhere
          </p>
        </div>
      </div>
    </div>
  );
}
