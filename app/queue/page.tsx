"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  QrCode,
  Pill,
  User,
  Phone,
  Calendar,
} from "lucide-react";

type QueueSection = "general" | "pharmacy";

export default function QueuePage() {
  const [section, setSection] = useState<QueueSection>("general");
  const [refreshing, setRefreshing] = useState(false);

  const isYourTurn = false;
  const yourPosition = 5;
  const totalInQueue = 18;
  const estimatedWait = 25;

  const queueList = [
    { token: "PH-042", name: "Ramesh S.", status: "in-room" },
    { token: "PH-043", name: "Priya D.", status: "waiting" },
    { token: "PH-044", name: "Harjinder K.", status: "waiting" },
    { token: "PH-045", name: "Sunita M.", status: "waiting" },
    { token: "PH-046", name: "Gurpreet S.", status: "waiting" },
    { token: "PH-047", name: "You", status: "you" },
    { token: "PH-048", name: "Vikram R.", status: "waiting" },
    { token: "PH-049", name: "Anita P.", status: "waiting" },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-5 py-4 flex items-center gap-3"
        style={{
          background: "var(--color-card)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Link
          href="/"
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "var(--color-surface)" }}
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" style={{ color: "var(--color-text)" }} />
        </Link>
        <h1 className="flex-1 font-bold text-base" style={{ color: "var(--color-text)" }}>
          Queue Status
        </h1>
        <button
          onClick={handleRefresh}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ background: "var(--color-surface)" }}
          aria-label="Refresh queue"
        >
          <RefreshCw
            className="w-4 h-4"
            style={{
              color: "var(--color-primary)",
              animation: refreshing ? "spin 1s linear infinite" : "none",
            }}
          />
        </button>
      </div>

      <div className="px-5 py-6 space-y-5">
        {/* Toggle: General / Pharmacy */}
        <div
          className="flex rounded-2xl p-1"
          style={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }}
        >
          {(["general", "pharmacy"] as QueueSection[]).map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 capitalize"
              style={{
                background: section === s
                  ? "linear-gradient(135deg, #0d9488, #0891b2)"
                  : "transparent",
                color: section === s ? "white" : "var(--color-text-muted)",
              }}
            >
              {s === "pharmacy" && <Pill className="w-4 h-4" />}
              {s === "general" && <User className="w-4 h-4" />}
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* "Your Turn" Hero / Status Card */}
        {isYourTurn ? (
          <div
            className="rounded-2xl p-6 text-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 8px 32px rgb(34 197 94 / 0.35)",
              animation: "pulse-ring 2s infinite",
            }}
          >
            <CheckCircle className="w-12 h-12 text-white mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white mb-1">It&apos;s Your Turn!</h2>
            <p className="text-green-100 text-sm">Please proceed to Room 3 — Dr. Rajesh Sharma</p>
          </div>
        ) : (
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #0d9488, #0891b2)",
              boxShadow: "0 8px 32px rgb(13 148 136 / 0.3)",
            }}
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10 bg-white" />
            <div className="flex items-start gap-5 relative z-10">
              <div className="flex-1">
                <p className="text-teal-100 text-xs font-medium mb-1">Your Position</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-black text-white">{yourPosition}</span>
                  <span className="text-teal-200 text-sm font-medium">/ {totalInQueue}</span>
                </div>
                <p className="text-teal-100 text-xs mt-1">in queue</p>
              </div>
              <div className="text-right">
                <div
                  className="rounded-xl px-4 py-3 bg-white/15 backdrop-blur-sm mb-2"
                >
                  <p className="text-teal-100 text-xs">Est. Wait</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-4 h-4 text-white" />
                    <span className="text-white font-bold text-lg">{estimatedWait}m</span>
                  </div>
                </div>
                <div className="rounded-xl px-4 py-3 bg-white/15 backdrop-blur-sm">
                  <p className="text-teal-100 text-xs">Ahead of you</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Users className="w-4 h-4 text-white" />
                    <span className="text-white font-bold text-lg">{yourPosition - 1}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5 relative z-10">
              <div className="flex justify-between text-teal-200 text-xs mb-1.5">
                <span>Progress</span>
                <span>{Math.round(((totalInQueue - yourPosition) / totalInQueue) * 100)}% done</span>
              </div>
              <div className="h-2 rounded-full bg-white/20">
                <div
                  className="h-2 rounded-full bg-white transition-all duration-700"
                  style={{ width: `${((totalInQueue - yourPosition) / totalInQueue) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Patient Details Card */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
              Your Token Details
            </h2>
            <span className="badge badge-primary">Token #PH-047</span>
          </div>
          <div className="space-y-2.5">
            {[
              { label: "Patient Name", value: "Rahul Kumar", icon: User },
              { label: "Doctor", value: "Dr. Rajesh Sharma", icon: Users },
              { label: "Department", value: "Cardiology — OPD A", icon: Calendar },
              { label: "Contact", value: "+91 98765 43210", icon: Phone },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 py-2 border-b last:border-b-0"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--color-surface)" }}
                >
                  <Icon className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{label}</p>
                  <p className="text-sm font-medium truncate" style={{ color: "var(--color-text)" }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QR Code */}
        <div className="card p-5 flex flex-col items-center text-center">
          <h2 className="font-bold text-sm mb-3" style={{ color: "var(--color-text)" }}>
            QR Code Check-In
          </h2>
          <div
            className="w-44 h-44 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: "linear-gradient(135deg, #f0fdfa, #ecfeff)",
              border: "2px solid var(--color-border)",
            }}
          >
            {/* Visual QR pattern */}
            <div className="relative">
              <QrCode className="w-28 h-28" style={{ color: "var(--color-primary)" }} />
              <div
                className="absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "white" }}
                >
                  <span className="text-lg">🏥</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            Scan at the reception counter for fast check-in
          </p>
          <p className="font-bold text-sm mt-1" style={{ color: "var(--color-primary)" }}>PH-2026-047</p>
        </div>

        {/* Live Queue List */}
        <div className="card overflow-hidden">
          <div
            className="px-5 py-4 flex items-center justify-between border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2 className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
              Live Queue
            </h2>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>Live</span>
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {queueList.map((item) => {
              const isInRoom = item.status === "in-room";
              const isYou = item.status === "you";
              return (
                <div
                  key={item.token}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                  style={{
                    background: isYou
                      ? "linear-gradient(135deg, #ccfbf1, #cffafe)"
                      : "transparent",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold"
                    style={{
                      background: isInRoom
                        ? "#dcfce7"
                        : isYou
                        ? "linear-gradient(135deg, #0d9488, #0891b2)"
                        : "var(--color-surface)",
                      color: isInRoom
                        ? "#16a34a"
                        : isYou
                        ? "white"
                        : "var(--color-text-muted)",
                    }}
                  >
                    {isInRoom ? <CheckCircle className="w-4 h-4" /> : item.token.split("-")[1]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: isYou ? "#0f766e" : "var(--color-text)" }}
                    >
                      {item.name} {isYou && "← You"}
                    </p>
                    <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {item.token}
                    </p>
                  </div>
                  <div>
                    {isInRoom && (
                      <span className="badge badge-success">In Room</span>
                    )}
                    {isYou && (
                      <span className="badge badge-primary">Your Turn Soon</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alert */}
        <div
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{ background: "#fef3c7", border: "1px solid #fcd34d" }}
        >
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs leading-relaxed" style={{ color: "#92400e" }}>
            <strong>Reminder:</strong> Please be at the waiting area 5 minutes before your estimated time. Missing your turn resets your token to the end of the queue.
          </p>
        </div>
      </div>
    </div>
  );
}
