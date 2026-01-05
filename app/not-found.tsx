"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="flex h-screen flex-col items-center justify-center px-6 text-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Search className="w-16 h-16 text-muted-foreground animate-pulse" />
        </div>

        <h1 className="text-6xl font-bold tracking-tight">404</h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
      </div>

      <div className="flex gap-4">
        <Button variant="default" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>

        <Button variant="outline" asChild>
          <a href="/Home">
            <Search className="w-4 h-4 mr-2" />
            Home
          </a>
        </Button>
      </div>

      <footer className="text-sm text-muted-foreground mt-4">
        © {new Date().getFullYear()} — Project Flow
      </footer>
    </main>
  );
}
