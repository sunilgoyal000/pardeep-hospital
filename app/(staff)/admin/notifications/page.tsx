import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { notificationsService } from "@/modules/notifications/service";
import NotificationsClient from "@/components/admin/notifications/NotificationsClient";
import type { SessionUser } from "@/shared/types/auth";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/admin/login");

  const user: SessionUser = {
    id: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: session.user.role,
  };

  const data = await notificationsService.list(user, { limit: 100 });
  return <NotificationsClient initialNotifications={data} />;
}
