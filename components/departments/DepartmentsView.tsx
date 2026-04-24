"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Grid3X3,
  List,
  Star,
  ChevronRight,
  Filter,
} from "lucide-react";
import { departments } from "@/data/departments";
import { doctors } from "@/data/doctors";

type ViewMode = "grid" | "list";

export default function DepartmentsView() {
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const filters = ["all", "available", "top rated"];

  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  const visibleDepts = expanded ? filteredDepts : filteredDepts.slice(0, 8);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-surface)" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-5 py-4"
        style={{
          background: "var(--color-card)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Link
            href="/"
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: "var(--color-surface)" }}
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" style={{ color: "var(--color-text)" }} />
          </Link>
          <h1 className="flex-1 font-bold text-base" style={{ color: "var(--color-text)" }}>
            Departments & Doctors
          </h1>
          <div className="flex items-center gap-1">
            {(["grid", "list"] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: view === v
                    ? "linear-gradient(135deg, #0d9488, #0891b2)"
                    : "var(--color-surface)",
                }}
                aria-label={`${v} view`}
              >
                {v === "grid"
                  ? <Grid3X3 className="w-4 h-4" style={{ color: view === v ? "white" : "var(--color-text-muted)" }} />
                  : <List className="w-4 h-4" style={{ color: view === v ? "white" : "var(--color-text-muted)" }} />
                }
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
          style={{ background: "var(--color-surface)", border: "1.5px solid var(--color-border)" }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-text-muted)" }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search departments, specialties..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: "var(--color-text)" }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs px-2 py-0.5 rounded-md"
              style={{ color: "var(--color-text-muted)" }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="px-5 py-5 space-y-6">
        {/* Filter Chips */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-text-muted)" }} />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 capitalize"
                style={{
                  background: activeFilter === f
                    ? "linear-gradient(135deg, #0d9488, #0891b2)"
                    : "var(--color-card)",
                  color: activeFilter === f ? "white" : "var(--color-text-muted)",
                  border: `1px solid ${activeFilter === f ? "transparent" : "var(--color-border)"}`,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Departments Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base" style={{ color: "var(--color-text)" }}>
              All Departments
              <span
                className="ml-2 text-sm font-normal"
                style={{ color: "var(--color-text-muted)" }}
              >
                ({filteredDepts.length})
              </span>
            </h2>
          </div>

          {view === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {visibleDepts.map((dept) => (
                <Link key={dept.id} href="/" className="card p-4 flex flex-col items-center text-center gap-2 group">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-200 group-hover:scale-110"
                    style={{ background: dept.color }}
                  >
                    {dept.icon}
                  </div>
                  <p className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
                    {dept.name}
                  </p>
                  <p className="text-xs leading-tight" style={{ color: "var(--color-text-muted)" }}>
                    {dept.description}
                  </p>
                  <span className="badge badge-primary">{dept.doctors} doctors</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {visibleDepts.map((dept) => (
                <Link key={dept.id} href="/" className="card p-4 flex items-center gap-4 group">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                    style={{ background: dept.color }}
                  >
                    {dept.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
                      {dept.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                      {dept.description}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="badge badge-primary">{dept.doctors} docs</span>
                    <ChevronRight className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredDepts.length > 8 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="btn-outline w-full mt-4"
            >
              {expanded ? "Show Less" : `See All (${filteredDepts.length - 8} more)`}
            </button>
          )}
        </section>

        {/* Doctors Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-base" style={{ color: "var(--color-text)" }}>
              Our Specialists
            </h2>
          </div>
          <div className="space-y-3">
            {doctors.map((doc) => (
              <Link key={doc.id} href={`/doctors/${doc.id}`}>
                <div className="card p-4 flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-14 h-14 rounded-2xl object-cover"
                    />
                    {doc.available && (
                      <div
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                        style={{ background: "#22c55e" }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: "var(--color-text)" }}>
                      {doc.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                      {doc.specialization} · {doc.experience}yr exp
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>
                          {doc.rating}
                        </span>
                      </div>
                      <span className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                        ₹{doc.fee}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`badge ${doc.available ? "badge-success" : "badge-warning"}`}>
                      {doc.available ? "Available" : "Busy"}
                    </span>
                    <button className="btn-primary text-xs px-3 py-1.5">Book</button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
