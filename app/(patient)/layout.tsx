import Sidebar from "@/components/patient/layout/Sidebar";
import BottomNav from "@/components/patient/layout/BottomNav";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 min-w-0 lg:ml-64 pb-20 lg:pb-0 min-h-screen">{children}</main>
      <BottomNav />
    </div>
  );
}
