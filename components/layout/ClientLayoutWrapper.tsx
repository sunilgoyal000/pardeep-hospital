"use client";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div className="flex min-h-screen w-full">
      {/* Patient Sidebar */}
      {!isAdmin && <Sidebar />}

      {/* Main Content Area */}
      <main className={`flex-1 min-w-0 ${!isAdmin ? "lg:ml-64 pb-20 lg:pb-0" : ""} min-h-screen`}>
        {children}
      </main>

      {/* Patient Mobile Nav */}
      {!isAdmin && <BottomNav />}
    </div>
  );
}
