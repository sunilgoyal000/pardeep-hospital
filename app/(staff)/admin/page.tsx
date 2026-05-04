import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { dashboardService } from "@/modules/dashboard/service";
import DashboardClient from "@/components/admin/dashboard/DashboardClient";
import type { SessionUser } from "@/shared/types/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const user: SessionUser = {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: session.user.role,
  };

  const overview = await dashboardService.getOverview(user);
  return <DashboardClient overview={overview} />;
}
