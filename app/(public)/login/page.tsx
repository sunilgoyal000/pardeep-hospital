"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Mail, Lock, Eye, EyeOff, 
  ArrowRight, Chrome, Facebook, ChevronLeft,
  ShieldCheck, Smartphone
} from "lucide-react";
import Logo from "@/components/ui/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* ── Left Side: Form ── */}
      <div className="flex flex-col p-8 md:p-12 lg:p-20 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-50 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-60" />

        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-12 text-slate-400 hover:text-teal-600 transition-colors group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Back to Website</span>
          </Link>

          <div className="flex items-center gap-3 mb-10">
            <Logo className="w-12 h-12" />
            <div>
              <p className="font-black text-2xl tracking-tighter text-slate-900 leading-none uppercase">PARDEEP</p>
              <p className="text-[11px] font-bold text-teal-600 tracking-[0.25em] uppercase mt-0.5">Hospital</p>
            </div>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Patient Portal</h1>
            <p className="text-slate-500 font-medium">Enter your credentials to access your healthcare dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 max-w-md">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email or Phone</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="rahul@example.com"
                  className="block w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all font-medium text-slate-900"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                <Link href="#" className="text-xs font-black text-teal-600 uppercase tracking-widest hover:underline">Forgot?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-teal-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="block w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-teal-500 outline-none transition-all font-medium text-slate-900"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
              <span className="text-sm font-bold text-slate-600">Remember me</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-5 h-5" /></>
              )}
            </button>

            <div className="relative py-4 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-4 text-xs font-black uppercase tracking-widest text-slate-400">Or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" className="flex items-center justify-center gap-3 py-3 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98]">
                <Chrome className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-bold text-slate-900">Google</span>
              </button>
              <button type="button" className="flex items-center justify-center gap-3 py-3 border-2 border-slate-100 rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98]">
                <Smartphone className="w-5 h-5 text-slate-600" />
                <span className="text-sm font-bold text-slate-900">Phone</span>
              </button>
            </div>
          </form>

          <p className="mt-12 text-center max-w-md text-sm font-bold text-slate-400">
            Don't have an account? <Link href="/departments" className="text-teal-600 hover:underline">Register Now</Link>
          </p>
        </div>
      </div>

      {/* ── Right Side: Image/Info ── */}
      <div className="hidden lg:flex relative bg-teal-600 items-center justify-center p-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full blur-[150px] -mr-96 -mt-96" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-black rounded-full blur-[150px] -ml-48 -mb-48" />
        </div>

        <div className="relative z-10 max-w-lg">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-10 border border-white/20">
            <ShieldCheck className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl font-black text-white leading-tight mb-8">Your Health, <br /> Secure and <br /> Accessible.</h2>
          <div className="space-y-8">
            {[
              { title: "Privacy First", desc: "Your medical data is encrypted and accessible only by you and your doctor." },
              { title: "24/7 Access", desc: "Book appointments, view lab results, and manage prescriptions anytime." },
              { title: "Integrated Queue", desc: "Live position updates to ensure your time is valued and managed." },
            ].map((feature, i) => (
              <div key={i} className="flex gap-6">
                <div className="w-1.5 h-12 bg-white/20 rounded-full flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-teal-100 font-medium leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
