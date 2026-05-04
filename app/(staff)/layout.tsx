import type { Metadata } from "next";
import { ToastProvider } from "@/components/admin/ui/ToastProvider";
import ClientAdminWrapper from "@/components/admin/layout/ClientAdminWrapper";
import { AdminRoleProvider } from "@/context/AdminRoleContext";

export const metadata: Metadata = {
  robots: "noindex",
};

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminRoleProvider>
        <ClientAdminWrapper>{children}</ClientAdminWrapper>
      </AdminRoleProvider>
    </ToastProvider>
  );
}
