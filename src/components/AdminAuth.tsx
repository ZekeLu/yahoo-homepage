"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AdminAuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const stored = localStorage.getItem("admin_token");
    if (stored) {
      setToken(stored);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const isLoginPage = pathname === "/admin/login";
    if (!token && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [token, loaded, pathname, router]);

  const login = (newToken: string) => {
    localStorage.setItem("admin_token", newToken);
    setToken(newToken);
    router.push("/admin");
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    router.push("/admin/login");
  };

  if (!loaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6001D2]" />
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
