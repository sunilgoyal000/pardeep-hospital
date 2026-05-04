import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { patientsService } from "@/modules/patients/service";
import PatientsClient from "@/components/admin/patients/PatientsClient";
import type { SessionUser } from "@/shared/types/auth";

export const dynamic = "force-dynamic";

export default async function AdminPatientsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const user: SessionUser = {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: session.user.role,
  };

  const data = await patientsService.list(user, { limit: 100 });
  return <PatientsClient initialPatients={data} />;
}
