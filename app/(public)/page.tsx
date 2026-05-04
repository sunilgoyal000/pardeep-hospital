"use client";
import Link from "next/link";
import { 
  ChevronRight, ArrowRight, ShieldCheck, Clock, Users, Star, 
  MapPin, Phone, Mail, Facebook, Twitter, Instagram, Stethoscope, 
  Building2, CalendarCheck, HeartPulse, Activity
} from "lucide-react";

import Logo from "@/components/ui/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <div>
              <p className="font-black text-xl tracking-tight text-slate-900 leading-none">PARDEEP</p>
              <p className="text-[10px] font-bold text-teal-600 tracking-[0.25em] uppercase mt-0.5">Hospital</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#services" className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors">Services</Link>
            <Link href="#doctors" className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors">Specialists</Link>
            <Link href="#about" className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors">About Us</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-slate-900 px-6 py-2.5 rounded-full hover:bg-slate-50 transition-all">Login</Link>
            <Link href="/dashboard" className="hidden sm:block text-sm font-bold text-white px-8 py-3 rounded-full bg-teal-600 hover:bg-teal-700 shadow-xl shadow-teal-200 transition-all active:scale-95">
              Portal Access
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="pt-40 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 text-xs font-black uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              25+ Years of Excellence
            </div>
            <h1 className="text-6xl md:text-7xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
              Advanced Care <br />
              <span className="text-teal-600">Personalized</span> <br />
              For You.
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-xl mb-10 font-medium">
              Experience healthcare redefined with our state-of-the-art facilities, expert specialists, and digital-first approach to patient care.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
              <Link href="/departments" className="group flex items-center justify-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200">
                Book Appointment <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center gap-4 px-6">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-4 border-white object-cover" />
                  ))}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">50,000+ Patients</p>
                  <p className="text-slate-500 text-xs font-medium">Trusted by families in Ludhiana</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-teal-100/50 rounded-full blur-[100px]" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-100/50 rounded-full blur-[100px]" />
            
            <div className="relative rounded-[40px] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] bg-white border border-slate-100">
              <img 
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000" 
                alt="Hospital Interior" 
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center shadow-lg shadow-teal-200">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">Live Status</p>
                      <p className="text-teal-600 text-xs font-bold uppercase tracking-wider">All departments active</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-slate-900">100%</p>
                    <p className="text-slate-500 text-[10px] font-bold">Reliability Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-12 border-y border-slate-50 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-12">
          {[
            { label: "Expert Doctors", val: "38+", icon: Stethoscope },
            { label: "Medical Beds", val: "150+", icon: Building2 },
            { label: "Departments", val: "12+", icon: HeartPulse },
            { label: "Year Founded", val: "1998", icon: CalendarCheck },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">{stat.val}</p>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Services Section ── */}
      <section id="services" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-teal-600 text-xs font-black uppercase tracking-[0.3em] mb-4">Our Specialities</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Comprehensive Healthcare Under One Roof</h3>
            <p className="text-lg text-slate-500 font-medium">From routine checkups to complex surgeries, we provide expert care across multiple disciplines.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Eye Care (Ophthalmology)", desc: "Expert treatment for cataracts, glaucoma, and vision correction using advanced LASIK technology.", icon: "👁️" },
              { title: "Orthopaedics", desc: "Specialized joint replacements, sports injury treatments, and trauma care by senior surgeons.", icon: "🦴" },
              { title: "Cardiology", desc: "Comprehensive heart care including diagnostic tests, pacemaker implants, and rehab.", icon: "🫀" },
              { title: "Internal Medicine", desc: "Management of chronic conditions like diabetes, hypertension, and complex internal disorders.", icon: "🩺" },
              { title: "Emergency Care", desc: "24/7 critical care unit with advanced life support and a dedicated response team.", icon: "🚑" },
              { title: "Laboratory & Imaging", desc: "Full suite of diagnostic services including X-Ray, ECG, and pathology lab.", icon: "🔬" },
            ].map((s, i) => (
              <div key={i} className="group p-8 rounded-[32px] bg-slate-50 border border-transparent hover:border-teal-200 hover:bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all">
                <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all">{s.icon}</div>
                <h4 className="text-xl font-bold text-slate-900 mb-4">{s.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium mb-8">{s.desc}</p>
                <Link href="/departments" className="inline-flex items-center gap-2 text-teal-600 font-bold text-sm">
                  Learn More <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-12 mb-20">
            <div className="max-w-2xl">
              <h2 className="text-teal-400 text-xs font-black uppercase tracking-[0.3em] mb-4">Patient Stories</h2>
              <h3 className="text-4xl md:text-5xl font-black leading-tight">Trusted by Thousands of Healthy Patients</h3>
            </div>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 cursor-pointer transition-all">
                <ChevronRight className="w-6 h-6 rotate-180" />
              </div>
              <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center hover:bg-teal-500 cursor-pointer transition-all">
                <ChevronRight className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Anita Sharma", role: "Patient", text: "The queue management system is a lifesaver. I could track my token from home and arrived exactly when my turn was near. Truly professional!" },
              { name: "Rajesh Varma", role: "Patient", text: "Exceptional care during my eye surgery. Dr. Pardeep and the staff are very attentive. The recovery was faster than I expected." },
              { name: "Sandeep Singh", role: "Patient", text: "Best diagnostic services in the city. Report accuracy and speed of delivery were top-notch. Highly recommended for family health checkups." },
            ].map((t, i) => (
              <div key={i} className="p-10 rounded-[32px] bg-white/5 backdrop-blur-xl border border-white/10">
                <div className="flex gap-1 mb-6 text-amber-400">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-lg leading-relaxed font-medium text-slate-300 mb-8 italic">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-teal-500/20" />
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[64px] overflow-hidden bg-teal-600 p-12 md:p-24 text-center">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-48 -mb-48" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">Ready to Prioritize Your Health?</h2>
              <p className="text-xl text-teal-50 font-medium mb-12">Join our digital healthcare platform today for seamless booking, queue tracking, and digital medical records.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/login" className="w-full sm:w-auto px-12 py-5 bg-white text-teal-600 rounded-2xl font-black text-lg hover:shadow-2xl transition-all active:scale-95">
                  Sign In to Portal
                </Link>
                <Link href="/departments" className="w-full sm:w-auto px-12 py-5 bg-teal-700 text-white border border-teal-500 rounded-2xl font-black text-lg hover:bg-teal-800 transition-all active:scale-95">
                  Find a Doctor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-50 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 lg:col-span-1">
               <div className="flex items-center gap-3 mb-8">
                <Logo className="w-10 h-10" />
                <div>
                  <p className="font-black text-xl tracking-tight text-slate-900 uppercase leading-none">PARDEEP</p>
                  <p className="text-[10px] font-bold text-teal-600 tracking-[0.25em] uppercase mt-0.5">Hospital</p>
                </div>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">Providing advanced medical care with compassion and excellence for over two decades.</p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-teal-600 cursor-pointer transition-all"><Facebook className="w-5 h-5" /></div>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-teal-600 cursor-pointer transition-all"><Twitter className="w-5 h-5" /></div>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-teal-600 cursor-pointer transition-all"><Instagram className="w-5 h-5" /></div>
              </div>
            </div>

            <div>
              <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Our Services</h5>
              <ul className="space-y-4">
                {["Eye Care", "Orthopaedics", "Cardiology", "Diagnostics", "Emergency 24/7"].map(item => (
                  <li key={item}><Link href="/departments" className="text-slate-500 font-bold text-sm hover:text-teal-600 transition-all">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Patient Care</h5>
              <ul className="space-y-4">
                {["Book Appointment", "Track Queue", "Staff Login", "Privacy Policy", "Feedback"].map(item => (
                  <li key={item}><Link href={item === "Staff Login" ? "/admin" : "/dashboard"} className="text-slate-500 font-bold text-sm hover:text-teal-600 transition-all">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-8">Contact Us</h5>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <p className="text-slate-500 text-sm font-medium">123 Medical Square, Main Road, Ludhiana, Punjab 141001</p>
                </li>
                <li className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <p className="text-slate-500 text-sm font-medium">+91 161 1234567</p>
                </li>
                <li className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <p className="text-slate-500 text-sm font-medium">contact@pardeephospital.com</p>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© 2026 Pardeep Hospital. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="#" className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-teal-600">Privacy</Link>
              <Link href="#" className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-teal-600">Terms</Link>
              <Link href="#" className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-teal-600">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
