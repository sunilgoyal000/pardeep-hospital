import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { usersService } from "@/modules/users/service";
import UsersClient from "@/components/admin/users/UsersClient";
import type { SessionUser } from "@/shared/types/auth";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const user: SessionUser = {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: session.user.role,
  };

  const data = await usersService.list(user, { limit: 200 });
  return <UsersClient initialUsers={data} currentUserId={user.id} />;
}
