"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative text-center py-14 px-4 sm:px-6 bg-linear-to-b from-black to-gray-900 text-white">
      <div className="max-w-5xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl font-semibold leading-tight mb-4">
          Take control of Project <br className="hidden sm:block" /> Manager
        </h1>

        <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-8 max-w-2xl">
          ProjectFlow helps you stay organized, manage your projects
          effectively, and keep track of your progress. All in one simple and
          intuitive platform.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto">
          <Button
            className="rounded-full w-full sm:w-auto text-sm sm:text-base"
            onClick={() => router.push("/SignUp")}
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Images Section */}
      {/* Note: In Next.js, using the <Image> component is recommended, 
          but standard <img> tags work fine for quick migration. */}
    </section>
  );
}
