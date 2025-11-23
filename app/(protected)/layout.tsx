"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserContextId } from "../context/AuthContext";
import Sidebar from "@/components/AppSideBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import LayoutFooter from "@/components/LayoutFooter";
import Loader from "@/components/Loader";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ThemeProvider } from "../context/ThemeContext";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userContextId, loading } = useUserContextId();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !userContextId) {
      router.replace("/SignIn");
    }
  }, [loading, userContextId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!userContextId) return null;

  return (
    <ThemeProvider defaultTheme="dark">
      <SidebarProvider defaultOpen={false}>
        <Sidebar />

        <SidebarInset>
          <header className="flex items-center justify-between border-b px-4 py-2 shadow-sm transition-all duration-200 ease-linear lg:hidden">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <Separator
                orientation="vertical"
                className="data-[orientation=vertical]:h-5"
              />
              <Breadcrumb className="text-sm font-semibold tracking-wide ">
                ProjectFlow
              </Breadcrumb>
            </div>
            <Avatar className="cursor-pointer hover:scale-105 transition-transform duration-200">
              <AvatarImage
                src="/todo-list-svgrepo-com.svg"
                alt="User Avatar"
                className="h-8 w-8 p-1"
              />
              <AvatarFallback className="text-[13px] font-medium ">
                U
              </AvatarFallback>
            </Avatar>
          </header>

          <div className="flex flex-col h-full w-full">
            <main className="flex-1 overflow-auto">{children}</main>
            <LayoutFooter />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
