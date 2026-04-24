import type { Metadata } from "next";
import DepartmentsPage from "@/components/departments/DepartmentsView";

export const metadata: Metadata = {
  title: "Departments & Specialists",
  description: "Browse all medical departments at Pardeep Hospital. Find the right specialist for your healthcare needs.",
};

export default function Departments() {
  return <DepartmentsPage />;
}
