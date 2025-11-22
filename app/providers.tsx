"use client";

import { UserProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/projectContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <ProjectProvider>{children}</ProjectProvider>
    </UserProvider>
  );
}
