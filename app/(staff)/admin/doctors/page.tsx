import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { doctorsService } from "@/modules/doctors/service";
import DoctorsClient from "@/components/admin/doctors/DoctorsClient";
import type { SessionUser } from "@/shared/types/auth";

export const dynamic = "force-dynamic";

export default async function AdminDoctorsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const user: SessionUser = {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: session.user.role,
  };

  const data = await doctorsService.listForAdmin(user, {});
  return <DoctorsClient initialDoctors={data} />;
}
