import type { Metadata } from "next";
import { ToastProvider } from "@/components/admin/ui/ToastProvider";
import ClientAdminWrapper from "@/components/admin/layout/ClientAdminWrapper";
import { AdminRoleProvider } from "@/context/AdminRoleContext";

export const metadata: Metadata = {
  title: { default: "Admin — Pardeep Hospital", template: "%s | Admin · Pardeep Hospital" },
  description: "Hospital management admin dashboard",
  robots: "noindex",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminRoleProvider>
        <ClientAdminWrapper>
          {children}
        </ClientAdminWrapper>
      </AdminRoleProvider>
    </ToastProvider>
  );
}
