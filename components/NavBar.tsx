"use client"; //

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-transparent">
      <div className="font-bold text-xl">ProjectFlow</div>

      <Button
        className="rounded-full"
        variant={"secondary"}
        onClick={() => router.push("/Login")} // 👈 Use router.push
      >
        Sign In
      </Button>
    </header>
  );
}
