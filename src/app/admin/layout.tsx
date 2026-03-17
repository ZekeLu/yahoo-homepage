"use client";

import { usePathname } from "next/navigation";
import AdminAuthProvider from "@/components/AdminAuth";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AdminAuthProvider>
      {isLoginPage ? (
        children
      ) : (
        <div className="min-h-screen bg-[#f5f5f5]">
          <AdminSidebar />
          <div className="lg:pl-64">
            <main className="p-6 lg:p-8">{children}</main>
          </div>
        </div>
      )}
    </AdminAuthProvider>
  );
}
