"use client";

import { SessionProvider } from "next-auth/react";
import { ProjectProvider } from "./context/projectContext";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ProjectProvider>{children}</ProjectProvider>
    </SessionProvider>
  );
}
