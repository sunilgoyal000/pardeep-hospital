"use client";
import { useState } from "react";
import { Pill, Upload, Send, Search, CheckCircle, Clock, AlertCircle, Camera, FileText, Bell } from "lucide-react";

export default function PharmacyPatientPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--color-surface)" }}>
      {/* Header */}
      <header
        className="px-5 pt-10 pb-16 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #059669, #10b981)" }}
      >
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-4">
            <Pill className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Online Pharmacy</h1>
          <p className="text-emerald-100 text-sm mt-1">Submit your prescription & get medicines ready</p>
        </div>
      </header>

      <div className="px-5 -mt-8 relative z-20">
        {step === 1 ? (
          <div className="card p-6 shadow-xl space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Prescription Upload */}
              <div className="space-y-3">
                <label className="block text-sm font-bold" style={{ color: "var(--color-text)" }}>
                  Upload Prescription
                </label>
                <div
                  className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 transition-colors cursor-pointer hover:bg-emerald-50"
                  style={{ borderColor: "var(--color-border)" }}
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Upload className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>Click to upload or take photo</p>
                    <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>Supported: JPG, PNG, PDF (Max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Patient Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                    Patient Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter name on prescription"
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-all focus:border-emerald-500"
                    style={{ background: "#f8fafc", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                      Patient ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="PH-12345"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                      style={{ background: "#f8fafc", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 00000 00000"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none border"
                      style={{ background: "#f8fafc", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div className="space-y-3">
                <label className="block text-sm font-bold" style={{ color: "var(--color-text)" }}>
                  Delivery Preference
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all border-emerald-500 bg-emerald-50"
                  >
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700">Self Pickup</span>
                  </button>
                  <button
                    type="button"
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all border-transparent bg-slate-50 opacity-60"
                  >
                    <AlertCircle className="w-5 h-5 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">Home Delivery</span>
                  </button>
                </div>
                <p className="text-[10px] text-center" style={{ color: "var(--color-text-muted)" }}>
                  * Home delivery currently limited to 5km radius.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, #059669, #10b981)",
                  boxShadow: "0 8px 24px rgb(16 185 129 / 0.3)",
                }}
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" /> Submit Request
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="card p-8 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto" style={{ animation: "fadeUp 0.6s ease-out" }}>
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>Request Submitted!</h2>
              <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>
                Your prescription has been sent to our pharmacy team. We will notify you via SMS once your medicines are ready for pickup.
              </p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <p className="text-xs font-bold text-emerald-800">Reference ID: #RX-2024-9842</p>
              <p className="text-[10px] text-emerald-600 mt-1">Est. processing time: 15-20 mins</p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="w-full py-3 rounded-xl border-2 font-bold text-sm transition-colors"
              style={{ borderColor: "var(--color-primary)", color: "var(--color-primary)" }}
            >
              Submit Another Request
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-bold px-1" style={{ color: "var(--color-text)" }}>How it works</h3>
          {[
            { icon: FileText, title: "Upload Prescription", desc: "Share a clear photo of your doctor's prescription." },
            { icon: Search, title: "Pharmacist Review", desc: "Our expert team verifies and prepares your medication." },
            { icon: Bell, title: "Get Notified", desc: "Receive a message when your order is ready." },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/50 border border-white">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "var(--color-text)" }}>{item.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RefreshCw({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  );
}
