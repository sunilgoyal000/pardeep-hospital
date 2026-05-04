import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, MapPin, Tag, ChevronRight } from "lucide-react";
import { events } from "@/data/events";

export const metadata: Metadata = {
  title: "Health Events & Updates",
  description: "Stay informed about health camps, medical events, vaccination drives, and wellness workshops at Pardeep Hospital.",
};

const categoryColors: Record<string, string> = {
  "Health Camp": "badge-success",
  "Vaccination": "badge-info",
  "Workshop": "badge-primary",
  "Donation Drive": "badge-warning",
  "Seminar": "badge-primary",
};

export default function EventsPage() {
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
          Events & Health Updates
        </h1>
      </div>

      <div className="px-5 py-6 space-y-8">
        {/* Featured Event (first one) */}
        <section>
          <h2 className="font-bold text-base mb-4" style={{ color: "var(--color-text)" }}>
            Featured Event
          </h2>
          <div
            className={`rounded-2xl p-6 bg-gradient-to-br ${events[0].color} relative overflow-hidden`}
            style={{ boxShadow: "0 8px 32px rgb(0 0 0 / 0.15)" }}
          >
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{events[0].icon}</span>
                <span className="badge bg-white/20 text-white border-0">{events[0].category}</span>
              </div>
              <h3 className="text-white font-bold text-xl mb-1">{events[0].title}</h3>
              <p className="text-white/80 text-sm mb-4">{events[0].subtitle}</p>
              <p className="text-white/70 text-xs leading-relaxed mb-4">{events[0].description}</p>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-medium">{events[0].date}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5">
                  <Clock className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-medium">{events[0].time}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-3 py-1.5">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-medium">{events[0].location}</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-white text-sm font-bold py-2.5 rounded-xl transition-all hover:shadow-lg" style={{ color: "#0d9488" }}>
                Register Now →
              </button>
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base" style={{ color: "var(--color-text)" }}>
              Upcoming Events
            </h2>
          </div>
          <div className="space-y-4">
            {events.slice(1).map((event, idx) => (
              <div
                key={event.id}
                className="card overflow-hidden"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Colored top strip */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${event.color}`} />
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: "var(--color-surface)" }}
                    >
                      {event.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className="font-bold text-sm"
                          style={{ color: "var(--color-text)" }}
                        >
                          {event.title}
                        </h3>
                        <span className={`badge ${categoryColors[event.category] || "badge-info"} flex-shrink-0`}>
                          {event.category}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                        {event.subtitle}
                      </p>
                      <p className="text-xs mt-2 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                        {event.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" style={{ color: "var(--color-primary)" }} />
                          <span className="text-xs font-medium" style={{ color: "var(--color-text)" }}>
                            {event.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" style={{ color: "var(--color-primary)" }} />
                          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                            {event.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" style={{ color: "var(--color-primary)" }} />
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button className="btn-primary flex-1 py-2 text-xs">Register</button>
                    <button className="btn-outline py-2 px-4 text-xs">Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter teaser */}
        <section>
          <div
            className="rounded-2xl p-5 flex items-start gap-4"
            style={{
              background: "linear-gradient(135deg, #0d9488, #0891b2)",
              boxShadow: "0 8px 24px rgb(13 148 136 / 0.25)",
            }}
          >
            <span className="text-3xl">📢</span>
            <div>
              <h3 className="text-white font-bold text-sm">Stay Updated</h3>
              <p className="text-teal-100 text-xs mt-1">
                Get notified about upcoming health camps, new doctors, and appointments via SMS & WhatsApp.
              </p>
              <button className="mt-3 bg-white text-xs font-bold px-4 py-2 rounded-xl" style={{ color: "#0d9488" }}>
                Enable Notifications
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
