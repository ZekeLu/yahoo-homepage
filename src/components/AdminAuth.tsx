"use client";

import { createContext, useContext, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AdminAuthContextType {
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  logout: () => {},
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider value={{ logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
