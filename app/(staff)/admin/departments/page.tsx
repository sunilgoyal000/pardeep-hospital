import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { departmentsService } from "@/modules/departments/service";
import DepartmentsClient from "@/components/admin/departments/DepartmentsClient";
import type { SessionUser } from "@/shared/types/auth";

export const dynamic = "force-dynamic";

export default async function AdminDepartmentsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const user: SessionUser = {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: session.user.role,
  };

  const data = await departmentsService.list(user, {});
  return <DepartmentsClient initialDepartments={data} />;
}
