"use client";
import React, { createContext, useContext, useState } from "react";

export type AdminRole = "Super Admin" | "Doctor" | "Receptionist" | "Pharmacist";

interface AdminRoleContextType {
  role: AdminRole;
  setRole: (role: AdminRole) => void;
}

const AdminRoleContext = createContext<AdminRoleContextType | undefined>(undefined);

export function AdminRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<AdminRole>("Super Admin");

  return (
    <AdminRoleContext.Provider value={{ role, setRole }}>
      {children}
    </AdminRoleContext.Provider>
  );
}

export function useAdminRole() {
  const context = useContext(AdminRoleContext);
  if (context === undefined) {
    throw new Error("useAdminRole must be used within an AdminRoleProvider");
  }
  return context;
}
