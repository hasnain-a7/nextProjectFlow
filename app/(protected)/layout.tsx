"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserContextId } from "../context/AuthContext";
import Sidebar from "@/components/AppSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userContextId } = useUserContextId();
  const router = useRouter();

  useEffect(() => {
    if (!userContextId) {
      router.replace("/Login");
    }
  }, [userContextId, router]);

  if (!userContextId) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar />

        <main className="flex-1  overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
