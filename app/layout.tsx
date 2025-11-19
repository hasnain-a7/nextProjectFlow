"use client";
import { UserProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/projectContext";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <UserProvider>
          <ProjectProvider>{children}</ProjectProvider>
        </UserProvider>
      </body>
    </html>
  );
}
