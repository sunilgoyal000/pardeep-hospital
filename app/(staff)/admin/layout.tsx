import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin — Pardeep Hospital", template: "%s | Admin · Pardeep Hospital" },
  description: "Hospital management admin dashboard",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
