"use client";
import { useState, useEffect } from "react";
import {
  RefreshCw, SkipForward, UserCheck, AlertCircle, QrCode,
  Clock, Users, CheckCircle, XCircle, ChevronRight,
} from "lucide-react";
import { liveQueues } from "@/data/admin";
import { useToast } from "@/components/admin/ui/ToastProvider";

type QueueDept = typeof liveQueues[0];

const tokenStatusStyle: Record<string, { bg: string; color: string; label: string }> = {
  "in-room": { bg: "#dcfce7", color: "#16a34a", label: "In Room" },
  "called":  { bg: "#fef3c7", color: "#d97706", label: "Called" },
  "waiting": { bg: "#f1f5f9", color: "#64748b", label: "Waiting" },
};

function QueueCard({ q, onCall, onSkip }: { q: QueueDept; onCall: () => void; onSkip: () => void }) {
  const pct = Math.round((q.current / q.total) * 100);
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
    >
      {/* Colored top bar */}
      <div className="h-1.5" style={{ background: q.color }} />
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm" style={{ color: "var(--admin-text)" }}>{q.dept}</h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--admin-muted)" }}>{q.doctor}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-green-600">Live</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: "Total", value: q.total, icon: Users },
            { label: "Done", value: q.current, icon: CheckCircle },
            { label: "Waiting", value: q.waiting, icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl p-3 text-center" style={{ background: "var(--admin-surface)" }}>
              <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: q.color }} />
              <p className="text-lg font-bold" style={{ color: "var(--admin-text)" }}>{value}</p>
              <p className="text-xs" style={{ color: "var(--admin-muted)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1" style={{ color: "var(--admin-muted)" }}>
            <span>Queue Progress</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: "var(--admin-surface)" }}>
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: q.color }}
            />
          </div>
          <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--admin-muted)" }}>
            <Clock className="w-3 h-3" /> Avg wait: <strong style={{ color: "var(--admin-text)" }}>{q.avgWait} min</strong>
          </p>
        </div>

        {/* Live token list */}
        <div className="space-y-1.5 mb-4">
          {q.tokens.map((t) => {
            const st = tokenStatusStyle[t.status];
            return (
              <div
                key={t.no}
                className="flex items-center gap-3 px-3 py-2 rounded-xl"
                style={{ background: t.status === "in-room" ? "#f0fdf4" : "var(--admin-surface)" }}
              >
                <span
                  className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg flex-shrink-0"
                  style={{ background: st.bg, color: st.color }}
                >
                  {t.no}
                </span>
                <span className="text-xs flex-1" style={{ color: "var(--admin-text)" }}>{t.name}</span>
                <span className="text-xs font-medium" style={{ color: st.color }}>{st.label}</span>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onCall}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background: q.color }}
          >
            <UserCheck className="w-3.5 h-3.5" /> Call Next
          </button>
          <button
            onClick={onSkip}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border"
            style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}
          >
            <SkipForward className="w-3.5 h-3.5" /> Skip
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QueuePage() {
  const { showToast } = useToast();
  const [queues, setQueues] = useState(liveQueues);
  const [refreshing, setRefreshing] = useState(false);
  const [tick, setTick] = useState(0);

  // Simulated live tick every 30s
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); showToast("Queue data refreshed", "info"); }, 1000);
  };

  const handleCall = (deptIdx: number) => {
    const dept = queues[deptIdx];
    showToast(`Calling next patient in ${dept.dept}`, "success");
  };

  const handleSkip = (deptIdx: number) => {
    const dept = queues[deptIdx];
    showToast(`Token skipped in ${dept.dept}`, "warning");
  };

  const totalWaiting = queues.reduce((a, q) => a + q.waiting, 0);
  const totalDone = queues.reduce((a, q) => a + q.current, 0);
  const totalTokens = queues.reduce((a, q) => a + q.total, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--admin-text)" }}>Live Queue Management</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--admin-muted)" }}>
            Real-time across {queues.length} departments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ background: "#dcfce7", color: "#16a34a" }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live — {new Date().toLocaleTimeString()}
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors"
            style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}
          >
            <RefreshCw className="w-4 h-4" style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tokens Today", value: totalTokens, color: "#0d9488", bg: "#ccfbf1" },
          { label: "Currently Waiting", value: totalWaiting, color: "#d97706", bg: "#fef3c7" },
          { label: "Served Today", value: totalDone, color: "#22c55e", bg: "#dcfce7" },
          { label: "Active Departments", value: queues.length, color: "#8b5cf6", bg: "#ede9fe" },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xl flex-shrink-0"
              style={{ background: bg, color }}
            >
              {value}
            </div>
            <p className="text-sm font-medium leading-snug" style={{ color: "var(--admin-muted)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Alert if any dept has high wait */}
      {queues.some((q) => q.waiting > 4) && (
        <div
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{ background: "#fef3c7", border: "1px solid #fcd34d" }}
        >
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">High Queue Alert</p>
            <p className="text-xs text-amber-700 mt-0.5">
              {queues.filter((q) => q.waiting > 4).map((q) => q.dept).join(", ")} have more than 4 patients waiting.
              Consider opening additional consultation rooms.
            </p>
          </div>
        </div>
      )}

      {/* Queue Cards Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {queues.map((q, idx) => (
          <QueueCard
            key={q.dept}
            q={q}
            onCall={() => handleCall(idx)}
            onSkip={() => handleSkip(idx)}
          />
        ))}
      </div>

      {/* QR Check-In Panel */}
      <div
        className="rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6"
        style={{ background: "var(--admin-card)", border: "1px solid var(--admin-border)" }}
      >
        <div
          className="w-32 h-32 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--admin-surface)" }}
        >
          <QrCode className="w-20 h-20" style={{ color: "#0d9488" }} />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="font-bold text-base" style={{ color: "var(--admin-text)" }}>QR Self Check-In</h3>
          <p className="text-sm mt-1" style={{ color: "var(--admin-muted)" }}>
            Patients can scan this QR code at reception for instant self check-in, automatic token assignment, and SMS confirmation.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={() => showToast("QR code printed!", "success")}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#0d9488,#0891b2)" }}
            >
              Print QR Code
            </button>
            <button
              onClick={() => showToast("New QR code generated", "info")}
              className="px-4 py-2 rounded-xl text-sm font-semibold border"
              style={{ border: "1px solid var(--admin-border)", color: "var(--admin-muted)" }}
            >
              Regenerate QR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
