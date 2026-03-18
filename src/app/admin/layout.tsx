"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import AdminAuthProvider from "@/components/AdminAuth";

const AdminSidebar = dynamic(() => import("@/components/AdminSidebar"), {
  loading: () => (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[#1a0533] transition-transform lg:translate-x-0 -translate-x-full lg:translate-x-0">
      <div className="p-6">
        <div className="h-7 w-28 animate-pulse rounded bg-white/10" />
      </div>
    </aside>
  ),
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AdminAuthProvider>
      {isLoginPage ? (
        children
      ) : (
        <div className="min-h-screen bg-[#f5f5f5]">
          <Suspense fallback={null}>
            <AdminSidebar />
          </Suspense>
          <div className="lg:pl-64">
            <main className="p-6 lg:p-8">{children}</main>
          </div>
        </div>
      )}
    </AdminAuthProvider>
  );
}
