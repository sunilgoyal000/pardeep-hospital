"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, Lock, User, Eye, EyeOff, 
  ArrowRight, Key, Hospital, AlertCircle
} from "lucide-react";
import { useToast } from "@/components/admin/ui/ToastProvider";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate admin auth
    setTimeout(() => {
      setLoading(false);
      router.push("/admin");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[100px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -ml-64 -mb-64" />
      </div>

      <div className="w-full max-w-[440px] relative z-10">
        <div className="bg-white rounded-[32px] p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-slate-100">
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center shadow-xl shadow-teal-100 mb-6">
              <ShieldCheck className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Staff Portal Login</h1>
            <p className="text-slate-500 text-sm font-medium mt-2">Enter your administrative credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Staff ID / Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="e.g. ADM-9842"
                  className="block w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all text-sm font-semibold text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Key</label>
                <button type="button" className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline">Reset</button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-300 group-focus-within:text-teal-600 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-11 py-3.5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all text-sm font-semibold text-slate-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                Unauthorized access is strictly prohibited and monitored. Please use your hospital-issued identity.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-teal-100 hover:bg-teal-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>Authorize Access <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hospital className="w-4 h-4 text-slate-300" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Campus Hub</span>
              </div>
              <Link href="/login" className="text-[10px] font-bold text-teal-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                Patient Login <Key className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          Powered by Pardeep HealthOS · v2.4.0
        </p>
      </div>
    </div>
  );
}

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return <a href={href} className={className}>{children}</a>;
}
