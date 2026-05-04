import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { appointmentsService } from "@/modules/appointments/service";
import AppointmentsClient from "@/components/admin/appointments/AppointmentsClient";
import type { SessionUser } from "@/shared/types/auth";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const user: SessionUser = {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: session.user.role,
  };

  const data = await appointmentsService.list(user, { limit: 100 });
  return <AppointmentsClient initialAppointments={data} />;
}
